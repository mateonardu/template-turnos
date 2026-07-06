import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site.config'
import ThemeProvider from '../components/ThemeProvider'

/**
 * Marco común de las páginas de vuelta del checkout
 * (/turnos/success, /turnos/failure, /turnos/pending).
 */
export default function LayoutResultado({ children }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <img
          src={siteConfig.marca.logo}
          alt={siteConfig.marca.nombre}
          className="mb-8 h-12"
        />
        <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-md sm:p-8">
          {children}
        </div>
        <Link to="/" className="mt-6 text-sm underline opacity-70 hover:opacity-100">
          Volver al inicio
        </Link>
      </div>
    </ThemeProvider>
  )
}
