import { siteConfig } from '../config/site.config'
import { linkConsultaGeneral } from '../utils/whatsapp'

export default function Promo() {
  const { promo } = siteConfig

  return (
    <aside
      aria-label={promo.titulo}
      className="bg-primary px-6 py-6 text-white"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-heading text-xl font-bold md:text-2xl">
            {promo.titulo}
          </p>
          <p className="mt-1 text-sm text-white/90">{promo.texto}</p>
        </div>
        <a
          href={linkConsultaGeneral()}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-secondary px-6 py-2.5 font-semibold text-foreground transition-opacity hover:opacity-90"
        >
          Quiero la promo
        </a>
      </div>
    </aside>
  )
}
