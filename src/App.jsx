import { siteConfig } from './config/site.config'
import ThemeProvider from './components/ThemeProvider'
import { TurnosProvider } from './components/turnos/TurnosContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Promo from './components/Promo'
import Servicios from './components/Servicios'
import Turnos from './components/turnos/Turnos'
import Galeria from './components/Galeria'
import Testimonios from './components/Testimonios'
import Ubicacion from './components/Ubicacion'
import Footer from './components/Footer'
import BotonWhatsApp from './components/BotonWhatsApp'

/**
 * Única fuente de verdad del orden y la visibilidad de las secciones.
 * Las fijas llevan visible: true; las opcionales, su flag del config.
 */
const secciones = [
  { id: 'hero', Componente: Hero, visible: true },
  { id: 'promo', Componente: Promo, visible: siteConfig.secciones.promo && siteConfig.promo.activa },
  { id: 'servicios', Componente: Servicios, visible: true },
  { id: 'turnos', Componente: Turnos, visible: true },
  { id: 'galeria', Componente: Galeria, visible: siteConfig.secciones.galeria },
  { id: 'testimonios', Componente: Testimonios, visible: siteConfig.secciones.testimonios },
  { id: 'ubicacion', Componente: Ubicacion, visible: true },
]

export default function App() {
  return (
    <ThemeProvider>
      <TurnosProvider>
        <Header />
        <main>
          {secciones.map(
            ({ id, Componente, visible }) =>
              visible && <Componente key={id} />,
          )}
        </main>
        <Footer />
        <BotonWhatsApp />
      </TurnosProvider>
    </ThemeProvider>
  )
}
