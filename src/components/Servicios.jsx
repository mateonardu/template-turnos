import { siteConfig } from '../config/site.config'
import { formatDuracion, formatPrecio } from '../utils/format'
import { useTurnos } from './turnos/TurnosContext'

function ServicioCard({ servicio }) {
  const { elegirServicio } = useTurnos()
  const { badgeDestacado, cta } = siteConfig.textos.servicios

  return (
    <a
      href="#turnos"
      onClick={() => elegirServicio(servicio)}
      className="flex h-full flex-col overflow-hidden rounded-[20px] border border-secondary/70 bg-white shadow-[0_8px_26px_rgba(74,53,59,.08)] transition-all duration-300 hover:-translate-y-[5px] hover:border-primary hover:shadow-[0_18px_40px_rgba(74,53,59,.14)]"
    >
      <div className="relative h-52">
        <img
          src={servicio.imagen}
          alt={servicio.nombre}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {servicio.destacado && (
          <span className="absolute top-3 right-3 rounded-full bg-promo-bar px-3 py-1 text-[10.5px] font-bold tracking-[0.08em] text-promo-bar-foreground uppercase">
            {badgeDestacado}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-heading text-xl font-semibold">{servicio.nombre}</h3>
        <p className="flex-1 text-sm opacity-80">{servicio.descripcion}</p>

        <div className="mt-1 flex items-baseline justify-between gap-3">
          <span className="text-sm opacity-70">
            {formatDuracion(servicio.duracionMin)}
          </span>
          <span className="font-body text-lg font-bold text-primary">
            {formatPrecio(servicio.precio)}
          </span>
        </div>

        <div className="mt-2 border-t border-secondary/70 pt-3 text-sm font-bold text-primary">
          {cta}
        </div>
      </div>
    </a>
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

        <ul className="grid grid-cols-[repeat(auto-fit,minmax(245px,1fr))] gap-[22px]">
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
