import { useLayoutEffect } from 'react'
import { siteConfig } from '../config/site.config'

/**
 * Vuelca el tema del config como CSS variables en :root.
 * Tailwind (vía @theme inline en index.css) genera utilidades que leen
 * estas variables, así que esto es lo único que hay que ejecutar para
 * que toda la paleta y tipografía del sitio salgan del config.
 */
export default function ThemeProvider({ children }) {
  useLayoutEffect(() => {
    const { colores, fuenteTitulos, fuenteTexto, fuenteUI } = siteConfig.tema
    const root = document.documentElement

    root.style.setProperty('--color-primario', colores.primario)
    root.style.setProperty('--color-primario-hover', colores.primarioHover)
    root.style.setProperty('--color-secundario', colores.secundario)
    root.style.setProperty('--color-fondo', colores.fondo)
    root.style.setProperty('--color-texto', colores.texto)
    root.style.setProperty('--color-acento', colores.acento)
    root.style.setProperty('--color-promo-bar-fondo', colores.promoBarFondo)
    root.style.setProperty('--color-promo-bar-texto', colores.promoBarTexto)
    root.style.setProperty('--color-exito', colores.exito)
    root.style.setProperty('--color-estrellas', colores.estrellas)
    root.style.setProperty('--color-footer-fondo', colores.footerFondo)
    root.style.setProperty('--color-footer-texto', colores.footerTexto)
    root.style.setProperty('--fuente-titulos', fuenteTitulos)
    root.style.setProperty('--fuente-texto', fuenteTexto)
    root.style.setProperty('--fuente-ui', fuenteUI)

    document.title = `${siteConfig.marca.nombre} — ${siteConfig.marca.slogan}`
  }, [])

  return children
}
