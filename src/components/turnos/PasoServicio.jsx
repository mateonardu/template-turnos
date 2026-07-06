import { useCallback, useEffect, useState } from 'react'
import { getServicios } from '../../services/api'
import { formatDuracion, formatPrecio } from '../../utils/format'
import { useTurnos } from './TurnosContext'

export default function PasoServicio() {
  const { servicio: elegido, elegirServicio } = useTurnos()
  const [servicios, setServicios] = useState(null)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setError(null)
    setServicios(null)
    try {
      setServicios(await getServicios())
    } catch {
      setError('No pudimos cargar los servicios. Intentá de nuevo.')
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  // Las cards de la landing preseleccionan el servicio del config (id string).
  // Cuando llegan los servicios reales de la BD, se reemplaza por su
  // equivalente (mismo nombre) para que el wizard trabaje con ids reales.
  useEffect(() => {
    if (!servicios || !elegido) return
    if (servicios.some((s) => s.id === elegido.id)) return
    const real = servicios.find((s) => s.nombre === elegido.nombre)
    elegirServicio(real ?? null)
  }, [servicios, elegido, elegirServicio])

  if (error) {
    return (
      <div className="rounded-xl bg-secondary p-6 text-center">
        <p className="text-sm">{error}</p>
        <button
          type="button"
          onClick={cargar}
          className="mt-3 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (!servicios) {
    return (
      <div role="status" aria-label="Cargando servicios">
        <span className="sr-only">Cargando servicios...</span>
        <ul className="flex flex-col gap-2" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="animate-pulse rounded-xl border-2 border-secondary p-4">
              <div className="h-5 w-2/3 rounded bg-secondary" />
              <div className="mt-2 h-4 w-1/3 rounded bg-secondary" />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {servicios.map((servicio) => {
        const esElegido = elegido?.id === servicio.id
        const sena =
          servicio.porcentajeSena > 0
            ? Math.round((servicio.precio * servicio.porcentajeSena) / 100)
            : 0

        return (
          <li key={servicio.id}>
            <button
              type="button"
              onClick={() => elegirServicio(servicio)}
              aria-pressed={esElegido}
              className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${
                esElegido
                  ? 'border-primary bg-primary/5'
                  : 'border-secondary enabled:hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{servicio.nombre}</span>
                <span className="shrink-0 font-bold text-primary">
                  {formatPrecio(servicio.precio)}
                </span>
              </div>
              <p className="mt-0.5 text-sm opacity-70">
                {formatDuracion(servicio.duracionMin)}
                {sena > 0 && (
                  <>
                    {' · '}
                    <span className="text-accent">Seña {formatPrecio(sena)}</span>
                  </>
                )}
              </p>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
