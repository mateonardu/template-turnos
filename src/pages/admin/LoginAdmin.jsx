import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { siteConfig } from '../../config/site.config'
import ThemeProvider from '../../components/ThemeProvider'
import { useAdmin } from '../../context/AdminContext'

export default function LoginAdmin() {
  const { token, verificando, login } = useAdmin()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  if (!verificando && token) {
    return <Navigate to="/admin/agenda" replace />
  }

  const entrar = async (e) => {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await login(usuario.trim(), password)
      navigate('/admin/agenda', { replace: true })
    } catch (err) {
      setError(
        err.status === 401
          ? 'Usuario o contraseña incorrectos.'
          : 'No pudimos conectar con el servidor. Probá de nuevo.'
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen items-center justify-center px-6">
        <form
          onSubmit={entrar}
          className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-md sm:p-8"
        >
          <h1 className="font-heading text-xl font-bold">
            {siteConfig.marca.nombre}
          </h1>
          <p className="mt-1 text-sm opacity-70">Panel de administración</p>

          <label className="mt-6 block">
            <span className="text-sm font-medium">Usuario</span>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              required
              className="mt-1 w-full rounded-xl border-2 border-secondary p-3 outline-none transition-colors focus:border-primary"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-medium">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded-xl border-2 border-secondary p-3 outline-none transition-colors focus:border-primary"
            />
          </label>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="mt-6 w-full rounded-full bg-primary px-6 py-3 font-semibold text-white transition-opacity enabled:hover:opacity-90 disabled:opacity-70"
          >
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </ThemeProvider>
  )
}
