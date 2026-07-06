import { siteConfig } from '../config/site.config'
import { formatDuracion, formatPrecio } from '../utils/format'
import { useTurnos } from './turnos/TurnosContext'

function ServicioCard({ servicio }) {
  const { elegirServicio } = useTurnos()

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md">
      <div className="relative">
        <img
          src={servicio.imagen}
          alt={servicio.nombre}
          loading="lazy"
          className="h-48 w-full object-cover"
        />
        {servicio.destacado && (
          <span className="absolute top-3 right-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            Más pedido
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-heading text-xl font-semibold">{servicio.nombre}</h3>
        <p className="text-sm opacity-80">{servicio.descripcion}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm opacity-70">
            {formatDuracion(servicio.duracionMin)}
          </span>
          <span className="text-lg font-bold text-primary">
            {formatPrecio(servicio.precio)}
          </span>
        </div>

        <a
          href="#turnos"
          onClick={() => elegirServicio(servicio)}
          className="mt-2 rounded-full bg-primary px-6 py-2.5 text-center font-semibold text-white transition-opacity hover:opacity-90"
        >
          Reservar
        </a>
      </div>
    </article>
  )
}

export default function Servicios() {
  const { titulo, subtitulo } = siteConfig.textos.servicios

  return (
    <section id="servicios" className="bg-secondary px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            {titulo}
          </h2>
          <p className="mt-2 opacity-80">{subtitulo}</p>
        </header>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.servicios.map((servicio) => (
            <li key={servicio.id}>
              <ServicioCard servicio={servicio} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
