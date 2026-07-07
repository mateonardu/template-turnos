import { Navigate } from 'react-router-dom'
import { siteConfig } from '../../config/site.config'
import ThemeProvider from '../../components/ThemeProvider'
import { useAdmin } from '../../context/AdminContext'

/**
 * Marco de las páginas protegidas del panel: exige sesión activa
 * (si no hay, manda al login) y pinta el header con el nombre del
 * negocio y el botón de cerrar sesión. Pensado para celular.
 */
export default function LayoutAdmin({ titulo, children }) {
  const { token, verificando, logout } = useAdmin()

  if (verificando) {
    return (
      <ThemeProvider>
        <p role="status" className="p-8 text-center text-sm opacity-70">
          Verificando sesión...
        </p>
      </ThemeProvider>
    )
  }
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <ThemeProvider>
      <div className="mx-auto min-h-screen max-w-lg px-4 py-6">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="font-heading text-lg font-bold">
              {siteConfig.marca.nombre}
            </p>
            <p className="text-sm opacity-70">{titulo}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border-2 border-secondary px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            Cerrar sesión
          </button>
        </header>
        {children}
      </div>
    </ThemeProvider>
  )
}
