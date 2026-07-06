import { useMemo } from 'react'
import { generarSlots } from '../../utils/slots'
import { formatFecha } from '../../utils/format'

export default function PasoHorario({ servicio, fecha, hora, onElegirHora }) {
  const slots = useMemo(() => generarSlots(fecha, servicio), [fecha, servicio])

  const fechaLegible = formatFecha(fecha)

  return (
    <div>
      <p className="text-sm capitalize opacity-70">
        {fechaLegible} · {servicio.nombre}
      </p>

      {slots.length === 0 ? (
        <p className="mt-6 rounded-xl bg-secondary p-4 text-center text-sm">
          No hay horarios disponibles este día.
        </p>
      ) : (
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {slots.map((slot) => {
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
