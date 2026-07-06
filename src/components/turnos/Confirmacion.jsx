import { formatFecha } from '../../utils/format'
import { linkReservaTurno } from '../../utils/whatsapp'
import ResumenReserva from './ResumenReserva'

/** "mateo perez" → "Mateo Perez" */
function capitalizarNombre(nombre) {
  return nombre
    .trim()
    .split(/\s+/)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(' ')
}

export default function Confirmacion({ servicio, fecha, hora, datos, onReiniciar }) {
  const nombre = capitalizarNombre(datos.nombre)
  const urlWhatsApp = linkReservaTurno({
    servicio: servicio.nombre,
    fecha: formatFecha(fecha),
    hora,
    nombre,
  })

  return (
    <div role="status" className="text-center">
      <div
        aria-hidden="true"
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-white"
      >
        ✓
      </div>

      <h3 className="mt-4 font-heading text-2xl font-bold">
        ¡Listo, {nombre}!
      </h3>
      <p className="mt-1 text-sm opacity-80">
        Confirmá por WhatsApp para asegurar tu turno.
      </p>

      <div className="mt-5 text-left">
        <ResumenReserva servicio={servicio} fecha={fecha} hora={hora} />
      </div>

      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 block w-full rounded-full bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
      >
        Confirmar por WhatsApp
      </a>
      <button
        type="button"
        onClick={onReiniciar}
        className="mt-3 text-sm underline opacity-70 transition-opacity hover:opacity-100"
      >
        Hacer otra reserva
      </button>
    </div>
  )
}
