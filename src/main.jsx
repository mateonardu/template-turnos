import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import TurnoExito from './pages/TurnoExito.jsx'
import TurnoError from './pages/TurnoError.jsx'
import TurnoPendiente from './pages/TurnoPendiente.jsx'
import { AdminProvider, useAdmin } from './context/AdminContext.jsx'
import LoginAdmin from './pages/admin/LoginAdmin.jsx'
import AgendaAdmin from './pages/admin/AgendaAdmin.jsx'
import BloqueosAdmin from './pages/admin/BloqueosAdmin.jsx'

/** /admin: al login si no hay sesión, a la agenda si la hay. */
function AdminHome() {
  const { token, verificando } = useAdmin()
  if (verificando) return null
  return <Navigate to={token ? '/admin/agenda' : '/admin/login'} replace />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/turnos/success" element={<TurnoExito />} />
          <Route path="/turnos/failure" element={<TurnoError />} />
          <Route path="/turnos/pending" element={<TurnoPendiente />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/agenda" element={<AgendaAdmin />} />
          <Route path="/admin/bloqueos" element={<BloqueosAdmin />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  </StrictMode>,
)
