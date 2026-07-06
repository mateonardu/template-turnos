/**
 * Cliente de Prisma compartido (una sola instancia para todo el server)
 * y queries que usan varias rutas.
 */

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

/**
 * Turnos que ocupan agenda en un día: confirmados, más pendientes
 * cuya reserva todavía no venció.
 *
 * @param {Date} inicioDia
 * @param {Date} finDia
 * @returns {Promise<Array<{horaInicio: string, horaFin: string}>>}
 */
export function turnosQueOcupan(inicioDia, finDia) {
  return prisma.turno.findMany({
    where: {
      fecha: { gte: inicioDia, lt: finDia },
      OR: [
        { estado: 'confirmado' },
        { estado: 'pendiente', vencePendienteEn: { gt: new Date() } },
      ],
    },
    select: { horaInicio: true, horaFin: true },
  });
}
