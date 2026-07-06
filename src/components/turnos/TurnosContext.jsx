import { createContext, useContext, useState } from 'react'

/**
 * Comparte el servicio elegido entre las cards de Servicios y el wizard
 * de Turnos: el botón "Reservar" de una card preselecciona el servicio
 * y ancla a #turnos, donde el wizard lo muestra ya resaltado.
 */
const TurnosContext = createContext(null)

export function TurnosProvider({ children }) {
  const [servicio, setServicio] = useState(null)

  return (
    <TurnosContext.Provider value={{ servicio, elegirServicio: setServicio }}>
      {children}
    </TurnosContext.Provider>
  )
}

export function useTurnos() {
  return useContext(TurnosContext)
}
