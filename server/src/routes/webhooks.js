import { Router } from 'express';
import { prisma } from '../db.js';
import { obtenerPago } from '../mp.js';

export const webhooksRouter = Router();

/**
 * POST /api/webhooks/mercadopago — notificación de pagos de MP.
 * Requiere que el backend sea accesible públicamente (PUBLIC_URL);
 * en desarrollo local se puede exponer con ngrok.
 *
 * MP reintenta si no recibe 2xx, así que siempre respondemos 200
 * salvo error real procesando un pago existente.
 */
webhooksRouter.post('/mercadopago', async (req, res) => {
  // El id de pago puede venir en el body (webhook) o en la query (IPN).
  const tipo = req.body?.type ?? req.query.type ?? req.query.topic;
  const pagoId = req.body?.data?.id ?? req.query['data.id'] ?? req.query.id;

  if (tipo !== 'payment' || !pagoId) {
    return res.sendStatus(200); // notificación que no nos interesa
  }

  let pago;
  try {
    pago = await obtenerPago(pagoId);
  } catch (error) {
    console.error(`Webhook MP: no se pudo obtener el pago ${pagoId}:`, error.message);
    return res.sendStatus(200); // no reintentar un id que no existe
  }

  const turnoId = Number(pago.external_reference);
  if (!Number.isInteger(turnoId)) {
    console.error(`Webhook MP: pago ${pagoId} sin external_reference válido`);
    return res.sendStatus(200);
  }

  if (pago.status === 'approved') {
    const turno = await prisma.turno.findUnique({
      where: { id: turnoId },
      select: { estado: true },
    });

    if (!turno) {
      console.error(`Webhook MP: pago ${pago.id} aprobado para turno inexistente ${turnoId}`);
      return res.sendStatus(200);
    }

    // Si el job de limpieza ya lo canceló (venció el pendiente), no lo
    // resucitamos: el slot pudo haber sido tomado por otra clienta.
    if (turno.estado === 'cancelado') {
      console.error(
        `Pago aprobado sobre turno cancelado (id: ${turnoId}, pago: ${pago.id}) — requiere revisión manual`,
      );
      return res.sendStatus(200); // MP no debe reintentar esto
    }

    // Pendiente o ya confirmado (el webhook puede llegar dos veces):
    // confirmar y guardar el mpPagoId es idempotente.
    await prisma.turno.update({
      where: { id: turnoId },
      data: {
        estado: 'confirmado',
        mpPagoId: String(pago.id),
        vencePendienteEn: null,
      },
    });
    console.log(`✅ Turno ${turnoId} confirmado (pago ${pago.id})`);
  } else if (pago.status === 'rejected' || pago.status === 'cancelled') {
    console.log(`Webhook MP: pago ${pago.id} ${pago.status} para turno ${turnoId}`);
  }

  res.sendStatus(200);
});
