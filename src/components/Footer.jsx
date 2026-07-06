import { siteConfig } from '../config/site.config'
import { linkConsultaGeneral } from '../utils/whatsapp'
import { LINKS_NAV } from './Header'

const ETIQUETAS_REDES = { instagram: 'Instagram', tiktok: 'TikTok' }

export default function Footer() {
  const { marca, ubicacion, redes, creditos } = siteConfig
  const redesActivas = Object.entries(redes).filter(([, url]) => url)
  const anio = new Date().getFullYear()

  return (
    <footer className="bg-foreground px-6 py-12 text-background">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <p className="font-heading text-xl font-bold">{marca.nombre}</p>
          <p className="mt-2 text-sm opacity-80">{marca.descripcionCorta}</p>
        </div>

        <nav aria-label="Accesos rápidos">
          <p className="text-sm font-semibold tracking-wide uppercase opacity-60">
            Secciones
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {LINKS_NAV.map(({ etiqueta, ancla }) => (
              <li key={ancla}>
                <a href={ancla} className="hover:underline">
                  {etiqueta}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold tracking-wide uppercase opacity-60">
            Contacto
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              {ubicacion.direccion} · {ubicacion.barrio}, {ubicacion.ciudad}
            </li>
            <li>
              <a
                href={linkConsultaGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
              >
                WhatsApp
              </a>
            </li>
            {redesActivas.map(([red, url]) => (
              <li key={red}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:opacity-80"
                >
                  {ETIQUETAS_REDES[red] ?? red}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-background/20 pt-6 text-center text-xs opacity-70">
        © {anio} {marca.nombre}.{' '}
        <a
          href={creditos.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:opacity-100"
        >
          {creditos.texto}
        </a>
      </div>
    </footer>
  )
}
