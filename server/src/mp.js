/**
 * Integración con MercadoPago: creación de preferencias de pago
 * para la seña y consulta de pagos (usado por el webhook).
 */

import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// URL del frontend para las vueltas del checkout.
const FRONT_URL = process.env.FRONT_URL || 'http://localhost:5173';

// URL pública del backend (ngrok/producción). Sin ella MP no puede
// notificar el webhook, y la confirmación queda a cargo del frontend.
const PUBLIC_URL = process.env.PUBLIC_URL || '';

/**
 * Crea la preferencia de checkout para cobrar la seña de un turno.
 *
 * @param {{ id: number, montoSena: number, vencePendienteEn: Date|null }} turno
 * @param {{ nombre: string }} servicio
 * @returns {Promise<{ id: string, init_point: string }>}
 */
export async function crearPreferenciaSena(turno, servicio) {
  const body = {
    items: [
      {
        id: String(turno.id),
        title: `Seña — ${servicio.nombre}`,
        quantity: 1,
        unit_price: turno.montoSena,
        currency_id: 'ARS',
      },
    ],
    external_reference: String(turno.id),
    metadata: { turno_id: turno.id },
    // MP agrega external_reference y payment_id a la query al redirigir;
    // ?turno= va de respaldo por si algún flujo no los incluye.
    back_urls: {
      success: `${FRONT_URL}/turnos/success?turno=${turno.id}`,
      pending: `${FRONT_URL}/turnos/pending?turno=${turno.id}`,
      failure: `${FRONT_URL}/turnos/failure?turno=${turno.id}`,
    },
  };

  // La preferencia vence junto con la reserva del slot.
  if (turno.vencePendienteEn) {
    body.expires = true;
    body.expiration_date_to = turno.vencePendienteEn.toISOString();
  }

  if (PUBLIC_URL) {
    body.notification_url = `${PUBLIC_URL}/api/webhooks/mercadopago`;
  }

  // auto_return no acepta URLs localhost: solo se activa con FRONT_URL real.
  if (!FRONT_URL.includes('localhost')) {
    body.auto_return = 'approved';
  }

  const preferencia = await new Preference(mp).create({ body });
  return { id: preferencia.id, init_point: preferencia.init_point };
}

/**
 * Consulta un pago en MercadoPago por id.
 *
 * @param {string|number} pagoId
 * @returns {Promise<{ id: number, status: string, external_reference: string|null }>}
 */
export function obtenerPago(pagoId) {
  return new Payment(mp).get({ id: pagoId });
}
