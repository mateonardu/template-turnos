import { useState } from 'react'
import { siteConfig } from '../config/site.config'
import { useReveal } from '../hooks/useReveal'

const ALTO_MIN_PX = 8

function ItemGrilla({ item, index, onAbrir }) {
  const [ref, visible] = useReveal()
  const span = Math.round(item.alto / ALTO_MIN_PX) + 2

  return (
    <button
      ref={ref}
      type="button"
      onClick={onAbrir}
      style={{
        gridRowEnd: `span ${span}`,
        transitionDelay: visible ? `${(index % 4) * 80}ms` : '0ms',
      }}
      className={`block w-full cursor-pointer overflow-hidden rounded-2xl transition-all duration-700 ease-out ${
        visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}
    >
      <img
        src={item.imagen}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
      />
    </button>
  )
}

function ItemCarrusel({ item, index, handle, onAbrir }) {
  const [ref, visible] = useReveal()

  return (
    <button
      ref={ref}
      type="button"
      onClick={onAbrir}
      style={{ transitionDelay: visible ? `${(index % 4) * 80}ms` : '0ms' }}
      className={`relative h-[430px] w-[258px] flex-none snap-start overflow-hidden rounded-2xl transition-all duration-700 ease-out ${
        visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}
    >
      <img src={item.imagen} alt="" loading="lazy" className="h-full w-full object-cover" />
      {handle && (
        <span className="absolute top-3.5 left-3.5 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-foreground">
          {handle}
        </span>
      )}
    </button>
  )
}

export default function Galeria() {
  const { titulo, subtitulo, tabGrilla, tabCarrusel, hintCarrusel } =
    siteConfig.textos.galeria
  const { galeria, redes } = siteConfig
  const [modo, setModo] = useState('grilla')
  const [imagenAbierta, setImagenAbierta] = useState(null)

  const handle = redes.instagram
    ? `@${redes.instagram.replace(/\/$/, '').split('/').pop()}`
    : null

  return (
    <section id="galeria" className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <header>
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              {titulo}
            </h2>
            <p className="mt-2 opacity-80">{subtitulo}</p>
          </header>

          <div className="flex gap-1.5 rounded-full bg-secondary p-1.5">
            <button
              type="button"
              onClick={() => setModo('grilla')}
              aria-pressed={modo === 'grilla'}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                modo === 'grilla'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-foreground/60'
              }`}
            >
              {tabGrilla}
            </button>
            <button
              type="button"
              onClick={() => setModo('carrusel')}
              aria-pressed={modo === 'carrusel'}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                modo === 'carrusel'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-foreground/60'
              }`}
            >
              {tabCarrusel}
            </button>
          </div>
        </div>
      </div>

      {modo === 'grilla' ? (
        <div className="mx-auto max-w-6xl px-6">
          <div
            className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4"
            style={{ gridAutoRows: `${ALTO_MIN_PX}px` }}
          >
            {galeria.map((item, i) => (
              <ItemGrilla
                key={i}
                item={item}
                index={i}
                onAbrir={() => setImagenAbierta(item.imagen)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="scrollbar-oculta flex gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 snap-x snap-mandatory">
            {galeria.map((item, i) => (
              <ItemCarrusel
                key={i}
                item={item}
                index={i}
                handle={handle}
                onAbrir={() => setImagenAbierta(item.imagen)}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-xs opacity-60">{hintCarrusel}</p>
        </div>
      )}

      {imagenAbierta && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setImagenAbierta(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <button
            type="button"
            onClick={() => setImagenAbierta(null)}
            aria-label="Cerrar imagen"
            className="absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-2xl text-white"
          >
            ×
          </button>
          <img
            src={imagenAbierta}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85svh] max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </section>
  )
}
