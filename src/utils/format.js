/** 45 → "45 min" · 60 → "1 h" · 90 → "1 h 30 min" */
export function formatDuracion(minutos) {
  const h = Math.floor(minutos / 60)
  const min = minutos % 60
  if (h === 0) return `${min} min`
  if (min === 0) return `${h} h`
  return `${h} h ${min} min`
}

/** 28000 → "$28.000" */
export function formatPrecio(monto) {
  return `$${monto.toLocaleString('es-AR')}`
}

/** Date → "martes 7 de julio" */
export function formatFecha(fecha) {
  return fecha.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}
