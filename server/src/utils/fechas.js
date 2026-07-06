/**
 * Helpers de fechas para trabajar con fechas "YYYY-MM-DD" en hora local.
 */

/**
 * Parsea una fecha "YYYY-MM-DD" y devuelve el rango del día en hora local
 * más el día de la semana (0=domingo a 6=sábado). Devuelve null si el
 * formato o la fecha son inválidos (ej: "2026-02-31").
 *
 * @param {string} str
 * @returns {{inicioDia: Date, finDia: Date, diaSemana: number} | null}
 */
export function parseFecha(str) {
  if (typeof str !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;

  const [anio, mes, dia] = str.split('-').map(Number);
  const inicioDia = new Date(anio, mes - 1, dia);
  if (inicioDia.getMonth() !== mes - 1 || inicioDia.getDate() !== dia) return null;

  return {
    inicioDia,
    finDia: new Date(anio, mes - 1, dia + 1),
    diaSemana: inicioDia.getDay(),
  };
}
