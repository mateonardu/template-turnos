import { createContext, useContext, useEffect, useState } from 'react'
import { adminLogin, getAdminTurnos } from '../services/api'

const CLAVE_TOKEN = 'admin_token'

const AdminContext = createContext(null)

/** Usuario del payload del JWT (base64url), o null si no se puede leer. */
function usuarioDelToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.usuario ?? null
  } catch {
    return null
  }
}

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(CLAVE_TOKEN))
  // Mientras se valida el token guardado no se redirige a ningún lado.
  const [verificando, setVerificando] = useState(() => Boolean(localStorage.getItem(CLAVE_TOKEN)))

  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE_TOKEN)
    if (!guardado) return
    let cancelado = false

    getAdminTurnos(undefined, undefined, guardado)
      .catch((error) => {
        if (!cancelado && error.status === 401) {
          localStorage.removeItem(CLAVE_TOKEN)
          setToken(null)
        }
      })
      .finally(() => {
        if (!cancelado) setVerificando(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  const login = async (usuario, password) => {
    const { token: nuevo } = await adminLogin(usuario, password)
    localStorage.setItem(CLAVE_TOKEN, nuevo)
    setToken(nuevo)
  }

  const logout = () => {
    localStorage.removeItem(CLAVE_TOKEN)
    setToken(null)
  }

  const valor = {
    token,
    admin: token ? usuarioDelToken(token) : null,
    verificando,
    login,
    logout,
  }

  return <AdminContext.Provider value={valor}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  return useContext(AdminContext)
}
