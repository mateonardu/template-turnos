import { useCallback, useEffect, useState } from 'react'
import { getDisponibilidad } from '../../services/api'
import { formatFecha, formatFechaISO } from '../../utils/format'

export default function PasoHorario({ servicio, fecha, hora, onElegirHora, aviso }) {
  const [respuesta, setRespuesta] = useState(null)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setError(null)
    setRespuesta(null)
    try {
      setRespuesta(await getDisponibilidad(servicio.id, formatFechaISO(fecha)))
    } catch {
      setError('No pudimos cargar los horarios. Intentá de nuevo.')
    }
  }, [servicio.id, fecha])

  useEffect(() => {
    cargar()
  }, [cargar])

  return (
    <div>
      <p className="text-sm capitalize opacity-70">
        {formatFecha(fecha)} · {servicio.nombre}
      </p>

      {aviso && (
        <p className="mt-3 rounded-xl bg-accent/10 p-3 text-center text-sm text-accent">
          {aviso}
        </p>
      )}

      {error ? (
        <div className="mt-6 rounded-xl bg-secondary p-4 text-center text-sm">
          <p>{error}</p>
          <button
            type="button"
            onClick={cargar}
            className="mt-3 rounded-full bg-primary px-6 py-2 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Reintentar
          </button>
        </div>
      ) : !respuesta ? (
        <p role="status" className="mt-6 text-center text-sm opacity-70">
          Cargando horarios...
        </p>
      ) : !respuesta.disponible ? (
        <p className="mt-6 rounded-xl bg-secondary p-4 text-center text-sm">
          {respuesta.motivo === 'Cerrado'
            ? 'Ese día el local está cerrado. Elegí otra fecha.'
            : respuesta.motivo}
        </p>
      ) : respuesta.slots.length === 0 ? (
        <p className="mt-6 rounded-xl bg-secondary p-4 text-center text-sm">
          No hay horarios disponibles este día.
        </p>
      ) : (
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {respuesta.slots.map((slot) => {
            const esElegido = slot.hora === hora
            return (
              <li key={slot.hora}>
                <button
                  type="button"
                  disabled={slot.ocupado}
                  onClick={() => onElegirHora(slot.hora)}
                  aria-pressed={esElegido}
                  className={`w-full rounded-xl border-2 py-3 text-sm font-medium transition-colors disabled:line-through disabled:opacity-40 ${
                    esElegido
                      ? 'border-primary bg-primary text-white'
                      : 'border-secondary enabled:hover:border-primary/40'
                  }`}
                >
                  {slot.hora}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
