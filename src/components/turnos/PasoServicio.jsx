import { siteConfig } from '../../config/site.config'
import { formatDuracion, formatPrecio } from '../../utils/format'
import { useTurnos } from './TurnosContext'

export default function PasoServicio() {
  const { servicio: elegido, elegirServicio } = useTurnos()

  return (
    <ul className="flex flex-col gap-2">
      {siteConfig.servicios.map((servicio) => {
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
