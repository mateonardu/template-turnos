/**
 * Único punto de contacto con el backend de turnos.
 * Ningún componente hace fetch directo: todo pasa por acá.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export class ApiError extends Error {
  constructor(mensaje, status) {
    super(mensaje)
    this.status = status
  }
}

async function pedir(ruta, opciones) {
  let res
  try {
    res = await fetch(`${BASE_URL}${ruta}`, opciones)
  } catch {
    throw new ApiError('No pudimos conectar con el servidor. Revisá tu conexión.', 0)
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiError(data?.error ?? `Error del servidor (${res.status})`, res.status)
  }
  return data
}

/** Servicios activos: [{ id, nombre, descripcion, duracionMin, precio, porcentajeSena }] */
export function getServicios() {
  return pedir('/api/servicios')
}

/**
 * Disponibilidad de un día:
 * { disponible: true, fecha, slots: [{ hora, ocupado }] }
 * o { disponible: false, motivo }
 *
 * @param {number} servicioId
 * @param {string} fecha - "YYYY-MM-DD"
 */
export function getDisponibilidad(servicioId, fecha) {
  const params = new URLSearchParams({ servicioId, fecha })
  return pedir(`/api/disponibilidad?${params}`)
}

/**
 * Crea el turno. Con seña devuelve mpInitPoint para redirigir al
 * checkout de MercadoPago; sin seña el turno ya viene confirmado.
 *
 * @param {{ servicioId: number, fecha: string, horaInicio: string,
 *   nombreCliente: string, telefonoCliente: string, emailCliente?: string }} datos
 * @returns {Promise<{ turno: object, mpInitPoint: string|null, mpPreferenciaId: string|null }>}
 */
export async function crearTurno(datos) {
  const { turno, pago } = await pedir('/api/turnos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  return {
    turno,
    mpInitPoint: pago?.init_point ?? null,
    mpPreferenciaId: turno.mpPreferenciaId ?? null,
  }
}

/** Turno por id, con su servicio incluido. Usado al volver del checkout. */
export function getTurno(id) {
  return pedir(`/api/turnos/${id}`)
}
