import { useState } from 'react'
import { siteConfig } from '../config/site.config'

export default function Galeria() {
  const { titulo, subtitulo } = siteConfig.textos.galeria
  const [imagenAbierta, setImagenAbierta] = useState(null)

  return (
    <section id="galeria" className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            {titulo}
          </h2>
          <p className="mt-2 opacity-80">{subtitulo}</p>
        </header>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {siteConfig.galeria.map((imagen, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setImagenAbierta(imagen)}
                className="block w-full cursor-pointer overflow-hidden rounded-xl"
              >
                <img
                  src={imagen}
                  alt={`${siteConfig.marca.nombre} — foto ${i + 1}`}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

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
