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
    const { colores, fuenteTitulos, fuenteTexto } = siteConfig.tema
    const root = document.documentElement

    root.style.setProperty('--color-primario', colores.primario)
    root.style.setProperty('--color-secundario', colores.secundario)
    root.style.setProperty('--color-fondo', colores.fondo)
    root.style.setProperty('--color-texto', colores.texto)
    root.style.setProperty('--color-acento', colores.acento)
    root.style.setProperty('--fuente-titulos', fuenteTitulos)
    root.style.setProperty('--fuente-texto', fuenteTexto)

    document.title = `${siteConfig.marca.nombre} — ${siteConfig.marca.slogan}`
  }, [])

  return children
}
