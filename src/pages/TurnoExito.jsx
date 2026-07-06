import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getTurno } from '../services/api'
import { formatFecha, formatPrecio } from '../utils/format'
import { linkReservaTurno, linkConsultaGeneral } from '../utils/whatsapp'
import LayoutResultado from './LayoutResultado'

const REINTENTOS_MAX = 5
const INTERVALO_REINTENTO_MS = 3000

/**
 * Vuelta del checkout de MercadoPago. MP agrega external_reference
 * (el id del turno) a la URL; nuestras back_urls agregan ?turno= de
 * respaldo. Si el webhook todavía no confirmó el turno, reintenta.
 */
export default function TurnoExito() {
  const [params] = useSearchParams()
  const turnoId = params.get('external_reference') ?? params.get('turno')

  const [turno, setTurno] = useState(null)
  // 'verificando' | 'confirmado' | 'demorado' | 'error'
  const [estado, setEstado] = useState(turnoId ? 'verificando' : 'error')

  useEffect(() => {
    if (!turnoId) return
    let cancelado = false

    async function verificar(intento) {
      let datos
      try {
        datos = await getTurno(turnoId)
      } catch {
        if (!cancelado) setEstado('error')
        return
      }
      if (cancelado) return

      setTurno(datos)
      if (datos.estado === 'confirmado') {
        setEstado('confirmado')
      } else if (intento < REINTENTOS_MAX) {
        setTimeout(() => verificar(intento + 1), INTERVALO_REINTENTO_MS)
      } else {
        setEstado('demorado')
      }
    }

    verificar(1)
    return () => {
      cancelado = true
    }
  }, [turnoId])

  return (
    <LayoutResultado>
      {estado === 'verificando' ? (
        <div role="status">
          <span
            aria-hidden="true"
            className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary"
          />
          <h1 className="mt-4 font-heading text-2xl font-bold">
            Procesando tu pago...
          </h1>
          <p className="mt-2 text-sm opacity-80">
            Estamos confirmando tu turno, no cierres esta página.
          </p>
        </div>
      ) : estado === 'confirmado' ? (
        <TurnoConfirmado turno={turno} />
      ) : estado === 'demorado' ? (
        <div>
          <h1 className="font-heading text-2xl font-bold">
            Tu pago está en proceso
          </h1>
          <p className="mt-2 text-sm opacity-80">
            El pago se acreditó pero la confirmación está tardando más de lo
            normal. Escribinos por WhatsApp con tu nombre y te lo confirmamos
            al instante.
          </p>
          <a
            href={linkConsultaGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block w-full rounded-full bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Escribir por WhatsApp
          </a>
        </div>
      ) : (
        <div>
          <h1 className="font-heading text-2xl font-bold">
            No encontramos tu reserva
          </h1>
          <p className="mt-2 text-sm opacity-80">
            Si ya pagaste, no te preocupes: escribinos por WhatsApp y lo
            resolvemos enseguida.
          </p>
          <a
            href={linkConsultaGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block w-full rounded-full bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Escribir por WhatsApp
          </a>
        </div>
      )}
    </LayoutResultado>
  )
}

function TurnoConfirmado({ turno }) {
  const fechaLegible = formatFecha(new Date(turno.fecha))
  const urlWhatsApp = linkReservaTurno({
    servicio: turno.servicio.nombre,
    fecha: fechaLegible,
    hora: turno.horaInicio,
    nombre: turno.nombreCliente,
  })

  const filas = [
    ['Servicio', turno.servicio.nombre],
    ['Fecha', fechaLegible],
    ['Horario', `${turno.horaInicio} hs`],
    ['Seña pagada', formatPrecio(turno.montoSena)],
    ['Resta abonar', formatPrecio(turno.montoTotal - turno.montoSena)],
  ]

  return (
    <div role="status">
      <div
        aria-hidden="true"
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-white"
      >
        ✓
      </div>

      <h1 className="mt-4 font-heading text-2xl font-bold">
        ¡Turno confirmado, {turno.nombreCliente}!
      </h1>
      <p className="mt-1 text-sm opacity-80">
        Recibimos tu seña. Te esperamos.
      </p>

      <dl className="mt-5 rounded-xl bg-secondary p-4 text-left text-sm">
        {filas.map(([etiqueta, valor]) => (
          <div key={etiqueta} className="flex justify-between gap-3 py-0.5">
            <dt className="opacity-70">{etiqueta}</dt>
            <dd className="text-right font-medium capitalize">{valor}</dd>
          </div>
        ))}
      </dl>

      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 block w-full rounded-full bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
      >
        Confirmar por WhatsApp
      </a>
      <Link
        to="/"
        className="mt-3 inline-block text-sm underline opacity-70 hover:opacity-100"
      >
        Hacer otra reserva
      </Link>
    </div>
  )
}
