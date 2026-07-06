import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import TurnoExito from './pages/TurnoExito.jsx'
import TurnoError from './pages/TurnoError.jsx'
import TurnoPendiente from './pages/TurnoPendiente.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/turnos/success" element={<TurnoExito />} />
        <Route path="/turnos/failure" element={<TurnoError />} />
        <Route path="/turnos/pending" element={<TurnoPendiente />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
