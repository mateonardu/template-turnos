import { Router } from 'express';
import { prisma, turnosQueOcupan } from '../db.js';
import { parseFecha } from '../utils/fechas.js';
import { generarSlots, seSolapan, aMinutos, aHHMM } from '../utils/slots.js';

export const disponibilidadRouter = Router();

/** GET /api/disponibilidad?servicioId=X&fecha=YYYY-MM-DD */
disponibilidadRouter.get('/', async (req, res) => {
  const { servicioId, fecha } = req.query;

  if (!servicioId || !fecha) {
    return res
      .status(400)
      .json({ error: 'Faltan parámetros: servicioId y fecha son requeridos' });
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

  const servicio = await prisma.servicio.findUnique({ where: { id } });
  if (!servicio) {
    return res.status(404).json({ error: `Servicio no encontrado: ${id}` });
  }

  const horario = await prisma.horarioSemana.findFirst({
    where: { diaSemana: rango.diaSemana },
  });
  if (!horario || horario.cerrado) {
    return res.json({ disponible: false, motivo: 'Cerrado' });
  }

  const bloqueo = await prisma.bloqueo.findFirst({
    where: { fecha: { gte: rango.inicioDia, lt: rango.finDia } },
  });
  if (bloqueo) {
    return res.json({ disponible: false, motivo: bloqueo.motivo ?? 'Bloqueado' });
  }

  const ocupados = await turnosQueOcupan(rango.inicioDia, rango.finDia);

  const slots = generarSlots(horario.abre, horario.cierra, servicio.duracionMin).map(
    (hora) => {
      const fin = aHHMM(aMinutos(hora) + servicio.duracionMin);
      return {
        hora,
        ocupado: ocupados.some((t) => seSolapan(hora, fin, t.horaInicio, t.horaFin)),
      };
    }
  );

  res.json({ disponible: true, fecha, slots });
});
