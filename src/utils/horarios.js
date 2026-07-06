import { horarioDelDia } from './slots'

function aMinutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/**
 * Estado del local respecto de `ahora`:
 *  - abierto  → { abierto: true, cierra: '19:00' }
 *  - cerrado  → { abierto: false, abreDia: 'hoy' | 'martes', abreHora: '09:00' }
 *  - sin ningún día abierto en el config → { abierto: false }
 */
export function estadoLocal(ahora = new Date()) {
  const hoy = horarioDelDia(ahora)
  const minutos = ahora.getHours() * 60 + ahora.getMinutes()

  if (hoy && !hoy.cerrado) {
    if (minutos >= aMinutos(hoy.abre) && minutos < aMinutos(hoy.cierra)) {
      return { abierto: true, cierra: hoy.cierra }
    }
    if (minutos < aMinutos(hoy.abre)) {
      return { abierto: false, abreDia: 'hoy', abreHora: hoy.abre }
    }
  }

  // Ya cerró hoy (o hoy no abre): buscar el próximo día abierto.
  for (let i = 1; i <= 7; i++) {
    const dia = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate() + i,
    )
    const horario = horarioDelDia(dia)
    if (horario && !horario.cerrado) {
      return {
        abierto: false,
        abreDia: horario.dia.toLowerCase(),
        abreHora: horario.abre,
      }
    }
  }

  return { abierto: false }
}
