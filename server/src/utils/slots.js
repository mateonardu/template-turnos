/**
 * Lógica pura de slots de agenda: sin base de datos ni HTTP.
 * Las horas se manejan como strings "HH:MM".
 */

/**
 * Convierte "HH:MM" a minutos desde medianoche.
 *
 * @param {string} hhmm
 * @returns {number}
 */
export function aMinutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convierte minutos desde medianoche a "HH:MM".
 *
 * @param {number} minutos
 * @returns {string}
 */
export function aHHMM(minutos) {
  const hh = String(Math.floor(minutos / 60)).padStart(2, '0');
  const mm = String(minutos % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Indica si dos rangos horarios [inicioA, finA) y [inicioB, finB) se solapan.
 *
 * @param {string} inicioA - "HH:MM"
 * @param {string} finA - "HH:MM"
 * @param {string} inicioB - "HH:MM"
 * @param {string} finB - "HH:MM"
 * @returns {boolean}
 */
export function seSolapan(inicioA, finA, inicioB, finB) {
  return aMinutos(inicioA) < aMinutos(finB) && aMinutos(inicioB) < aMinutos(finA);
}

/**
 * Genera las horas de inicio posibles cada `intervaloMin` minutos,
 * desde la apertura, tales que el turno completo (duracionMin)
 * termine antes o justo al cierre.
 *
 * @param {string} abre - "HH:MM"
 * @param {string} cierra - "HH:MM"
 * @param {number} duracionMin - Duración del servicio.
 * @param {number} [intervaloMin=30]
 * @returns {string[]} Horas de inicio "HH:MM".
 */
export function generarSlots(abre, cierra, duracionMin, intervaloMin = 30) {
  const slots = [];
  const cierre = aMinutos(cierra);
  for (let t = aMinutos(abre); t + duracionMin <= cierre; t += intervaloMin) {
    slots.push(aHHMM(t));
  }
  return slots;
}
