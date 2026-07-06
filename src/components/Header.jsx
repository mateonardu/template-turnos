import { useEffect, useState } from 'react'
import { siteConfig } from '../config/site.config'

export const LINKS_NAV = [
  { etiqueta: 'Servicios', ancla: '#servicios' },
  { etiqueta: 'Turnos', ancla: '#turnos' },
  { etiqueta: 'Ubicación', ancla: '#ubicacion' },
]

export default function Header() {
  const { marca } = siteConfig
  const [scrolleado, setScrolleado] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolleado(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors ${
        scrolleado
          ? 'bg-background/90 text-foreground shadow-sm backdrop-blur-md'
          : 'bg-black/10 text-white backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#inicio" onClick={cerrarMenu} className="flex items-center gap-2">
          <img src={marca.logo} alt="" className="h-9 w-9" />
          <span className="font-heading text-lg font-bold">{marca.nombre}</span>
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-6 md:flex">
          {LINKS_NAV.map(({ etiqueta, ancla }) => (
            <a
              key={ancla}
              href={ancla}
              className="text-sm font-medium transition-opacity hover:opacity-75"
            >
              {etiqueta}
            </a>
          ))}
          <a
            href="#turnos"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Reservar
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-expanded={menuAbierto}
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-current transition-transform ${
              menuAbierto ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span className={`h-0.5 w-6 bg-current ${menuAbierto ? 'opacity-0' : ''}`} />
          <span
            className={`h-0.5 w-6 bg-current transition-transform ${
              menuAbierto ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {menuAbierto && (
        <nav
          aria-label="Principal"
          className="border-t border-secondary bg-background px-6 py-3 text-foreground shadow-md md:hidden"
        >
          {LINKS_NAV.map(({ etiqueta, ancla }) => (
            <a
              key={ancla}
              href={ancla}
              onClick={cerrarMenu}
              className="block py-3 font-medium"
            >
              {etiqueta}
            </a>
          ))}
          <a
            href="#turnos"
            onClick={cerrarMenu}
            className="mt-2 mb-3 block rounded-full bg-primary px-5 py-3 text-center font-semibold text-white"
          >
            Reservar
          </a>
        </nav>
      )}
    </header>
  )
}
