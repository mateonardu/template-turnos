import { Router } from 'express';
import { prisma } from '../db.js';
import { parseFecha } from '../utils/fechas.js';
import { seSolapan, aMinutos, aHHMM } from '../utils/slots.js';
import { crearPreferenciaSena } from '../mp.js';

export const turnosRouter = Router();

const MINUTOS_RESERVA_PENDIENTE = 15;

/**
 * POST /api/turnos — crea el turno y, si el servicio lleva seña,
 * la preferencia de MercadoPago para cobrarla.
 *
 * Respuesta:
 * - servicio sin seña → turno "confirmado" directo, sin pago.
 * - servicio con seña → turno "pendiente" + pago.init_point para
 *   redirigir al checkout; el slot queda reservado 15 minutos.
 */
turnosRouter.post('/', async (req, res) => {
  const { servicioId, fecha, horaInicio, nombreCliente, telefonoCliente, emailCliente } =
    req.body ?? {};

  const faltantes = Object.entries({ servicioId, fecha, horaInicio, nombreCliente, telefonoCliente })
    .filter(([, valor]) => valor === undefined || valor === null || valor === '')
    .map(([campo]) => campo);
  if (faltantes.length > 0) {
    return res.status(400).json({ error: `Faltan campos requeridos: ${faltantes.join(', ')}` });
  }

  const id = Number(servicioId);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: `servicioId inválido: ${servicioId}` });
  }

  const rango = parseFecha(fecha);
  if (!rango) {
    return res
      .status(400)
      .json({ error: `Fecha inválida: ${fecha}. Formato esperado: YYYY-MM-DD` });
  }

  if (!/^\d{2}:\d{2}$/.test(horaInicio)) {
    return res
      .status(400)
      .json({ error: `horaInicio inválida: ${horaInicio}. Formato esperado: HH:MM` });
  }

  const servicio = await prisma.servicio.findUnique({ where: { id } });
  if (!servicio) {
    return res.status(404).json({ error: `Servicio no encontrado: ${id}` });
  }

  const horaFin = aHHMM(aMinutos(horaInicio) + servicio.duracionMin);

  // El slot tiene que caer dentro del horario de apertura del día,
  // sin bloqueos, y sin solaparse con otros turnos vigentes.
  const horario = await prisma.horarioSemana.findFirst({
    where: { diaSemana: rango.diaSemana },
  });
  const bloqueo = await prisma.bloqueo.findFirst({
    where: { fecha: { gte: rango.inicioDia, lt: rango.finDia } },
  });
  const dentroDeHorario =
    horario &&
    !horario.cerrado &&
    aMinutos(horaInicio) >= aMinutos(horario.abre) &&
    aMinutos(horaFin) <= aMinutos(horario.cierra);

  if (!dentroDeHorario || bloqueo) {
    return res.status(409).json({ error: 'Horario no disponible' });
  }

  const montoSena = Math.round((servicio.precio * servicio.porcentajeSena) / 100);
  const llevaSena = montoSena > 0;

  // Check de solapamiento + create en una misma transacción Serializable:
  // dos requests simultáneos por el mismo slot no pueden pasar ambos
  // el check y crear los dos turnos (check-then-insert sin protección).
  let turno;
  try {
    turno = await prisma.$transaction(
      async (tx) => {
        // Turnos que ocupan agenda en el día: confirmados, más pendientes
        // cuya reserva todavía no venció (misma query que turnosQueOcupan,
        // pero sobre tx para que participe de la transacción).
        const ocupados = await tx.turno.findMany({
          where: {
            fecha: { gte: rango.inicioDia, lt: rango.finDia },
            OR: [
              { estado: 'confirmado' },
              { estado: 'pendiente', vencePendienteEn: { gt: new Date() } },
            ],
          },
          select: { horaInicio: true, horaFin: true },
        });
        const solapado = ocupados.some((t) =>
          seSolapan(horaInicio, horaFin, t.horaInicio, t.horaFin),
        );
        if (solapado) {
          const error = new Error('Horario no disponible');
          error.status = 409;
          throw error;
        }

        return tx.turno.create({
          data: {
            servicioId: servicio.id,
            fecha: rango.inicioDia,
            horaInicio,
            horaFin,
            nombreCliente,
            telefonoCliente,
            emailCliente: emailCliente || null,
            montoTotal: servicio.precio,
            montoSena,
            // Sin seña no hay nada que cobrar: se confirma directo.
            estado: llevaSena ? 'pendiente' : 'confirmado',
            vencePendienteEn: llevaSena
              ? new Date(Date.now() + MINUTOS_RESERVA_PENDIENTE * 60 * 1000)
              : null,
          },
        });
      },
      { isolationLevel: 'Serializable' },
    );
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ error: 'Horario no disponible' });
    }
    // P2034: conflicto de serialización — otro request ganó el slot.
    if (error.code === 'P2034') {
      return res.status(409).json({ error: 'Horario no disponible, intentá con otro.' });
    }
    throw error;
  }

  if (!llevaSena) {
    return res.status(201).json({ turno, pago: null });
  }

  let preferencia;
  try {
    preferencia = await crearPreferenciaSena(turno, servicio);
  } catch (error) {
    // Sin checkout no hay forma de pagar la seña: se libera el slot.
    await prisma.turno.delete({ where: { id: turno.id } });
    console.error('Error creando preferencia de MercadoPago:', error.message);
    return res
      .status(502)
      .json({ error: 'No se pudo iniciar el pago. Probá de nuevo en unos minutos.' });
  }

  const turnoConPreferencia = await prisma.turno.update({
    where: { id: turno.id },
    data: { mpPreferenciaId: preferencia.id },
  });

  res.status(201).json({
    turno: turnoConPreferencia,
    pago: { init_point: preferencia.init_point },
  });
});

/**
 * GET /api/turnos/:id — estado del turno, para que el frontend
 * lo consulte al volver del checkout.
 */
turnosRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: `Id de turno inválido: ${req.params.id}` });
  }

  const turno = await prisma.turno.findUnique({
    where: { id },
    include: { servicio: { select: { nombre: true, duracionMin: true } } },
  });
  if (!turno) {
    return res.status(404).json({ error: `Turno no encontrado: ${id}` });
  }

  res.json(turno);
});
