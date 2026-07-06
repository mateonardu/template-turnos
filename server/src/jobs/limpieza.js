/**
 * Job de limpieza: cancela turnos pendientes cuya reserva venció
 * (el cliente fue al checkout y nunca pagó). Dejar de bloquear el
 * slot ya lo resuelve turnosQueOcupan; esto además deja el estado
 * consistente en la base.
 */

import { prisma } from '../db.js';

const INTERVALO_MS = 5 * 60 * 1000;

/**
 * Cancela los turnos pendientes vencidos y devuelve cuántos fueron.
 *
 * @returns {Promise<number>}
 */
export async function limpiarPendientesVencidos() {
  const { count } = await prisma.turno.updateMany({
    where: {
      estado: 'pendiente',
      vencePendienteEn: { lt: new Date() },
    },
    data: { estado: 'cancelado' },
  });

  if (count > 0) {
    console.log(`🧹 Limpieza: ${count} turno(s) pendiente(s) vencido(s) → cancelado`);
  }
  return count;
}

/**
 * Corre la limpieza una vez ya mismo y después cada 5 minutos.
 * Un fallo puntual (ej: MySQL caído un instante) no corta el ciclo.
 */
export function startLimpieza() {
  const correr = () =>
    limpiarPendientesVencidos().catch((error) => {
      console.error('Error en limpieza de pendientes:', error.message);
    });

  correr();
  setInterval(correr, INTERVALO_MS);
}
