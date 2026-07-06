import { siteConfig } from '../config/site.config'

export default function Testimonios() {
  const { titulo, subtitulo } = siteConfig.textos.testimonios

  return (
    <section id="testimonios" className="py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 px-6 text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            {titulo}
          </h2>
          <p className="mt-2 opacity-80">{subtitulo}</p>
        </header>

        {/* Mobile: carrusel horizontal con scroll-snap · Desktop: 3 en fila */}
        <ul className="scrollbar-oculta flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
          {siteConfig.testimonios.map((testimonio) => (
            <li
              key={testimonio.nombre}
              className="w-[85%] max-w-sm flex-shrink-0 snap-start md:w-auto md:max-w-none"
            >
              <figure className="flex h-full flex-col rounded-2xl bg-secondary p-6">
                <blockquote className="flex-1 text-sm leading-relaxed opacity-90">
                  “{testimonio.texto}”
                </blockquote>
                <figcaption className="mt-4">
                  <p className="font-semibold">{testimonio.nombre}</p>
                  <p className="text-xs text-accent">{testimonio.servicio}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
