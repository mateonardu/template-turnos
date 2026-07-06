import { siteConfig } from '../config/site.config'

const DIAS_SEMANA = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

/**
 * Entrada de siteConfig.horarios que corresponde a una fecha (por nombre de día).
 * Se usa para la cartelería (estado del local) y para deshabilitar días
 * cerrados en el calendario. Los slots reales ya no se generan acá:
 * vienen del backend vía getDisponibilidad().
 */
export function horarioDelDia(fecha) {
  return siteConfig.horarios.find((h) => h.dia === DIAS_SEMANA[fecha.getDay()])
}
