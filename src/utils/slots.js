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

const INTERVALO_MIN = 30
const PROPORCION_OCUPADOS = 0.35

/** Entrada de siteConfig.horarios que corresponde a una fecha (por nombre de día). */
export function horarioDelDia(fecha) {
  return siteConfig.horarios.find((h) => h.dia === DIAS_SEMANA[fecha.getDay()])
}

function aMinutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function aHHMM(minutos) {
  const h = String(Math.floor(minutos / 60)).padStart(2, '0')
  const m = String(minutos % 60).padStart(2, '0')
  return `${h}:${m}`
}

/* Hash djb2: mismo string → mismo número, sin aleatoriedad entre renders. */
function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = (h * 33 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

/* Clave en hora local (nunca toISOString: en UTC-3 corre la fecha un día). */
function claveFecha(fecha) {
  return `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`
}

/**
 * Slots de un día para un servicio: [{ hora: 'HH:MM', ocupado: bool }].
 * Genera cada 30 min desde la apertura, solo si el turno completo
 * (duración del servicio) termina a más tardar al cierre.
 * Los "ocupados" son simulados para la demo: derivan de un hash de
 * fecha+hora, así son estables entre renders y visitas.
 */
export function generarSlots(fecha, servicio) {
  const horario = horarioDelDia(fecha)
  if (!horario || horario.cerrado) return []

  const apertura = aMinutos(horario.abre)
  const cierre = aMinutos(horario.cierra)
  const slots = []

  for (
    let inicio = apertura;
    inicio + servicio.duracionMin <= cierre;
    inicio += INTERVALO_MIN
  ) {
    const hora = aHHMM(inicio)
    const ocupado =
      hash(`${claveFecha(fecha)} ${hora}`) % 100 < PROPORCION_OCUPADOS * 100
    slots.push({ hora, ocupado })
  }

  return slots
}
