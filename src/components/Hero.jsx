import { siteConfig } from '../config/site.config'
import { linkConsultaGeneral } from '../utils/whatsapp'

export default function Hero() {
  const { marca } = siteConfig
  const whatsappUrl = linkConsultaGeneral()

  return (
    <section
      id="inicio"
      aria-label={marca.nombre}
      className="relative flex min-h-svh items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${marca.heroImagen})` }}
    >
      {/* Overlay oscuro suave para legibilidad del texto */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center text-white">
        <img
          src={marca.logo}
          alt=""
          className="h-20 w-20 rounded-full border-2 border-white p-1.5 md:h-24 md:w-24"
        />

        <h1 className="font-heading text-4xl font-bold md:text-6xl">
          {marca.nombre}
        </h1>

        <p className="text-lg text-white/90 md:text-xl">{marca.slogan}</p>

        <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href="#turnos"
            className="rounded-full bg-primary px-8 py-3 text-center font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
          >
            Reservá tu turno
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-white px-8 py-3 text-center font-semibold text-white transition-colors hover:bg-white/10"
          >
            Escribinos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
