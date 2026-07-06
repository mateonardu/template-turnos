import { useState } from 'react'
import { horarioDelDia } from '../../utils/slots'

const DIAS_CORTOS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']
const MAX_MESES_ADELANTE = 2

export default function PasoFecha({ fecha, onElegirFecha }) {
  const [offsetMes, setOffsetMes] = useState(0)

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const mes = new Date(hoy.getFullYear(), hoy.getMonth() + offsetMes, 1)
  const diasEnMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate()
  const columnaInicial = (mes.getDay() + 6) % 7 // semana empieza en lunes
  const nombreMes = mes.toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOffsetMes(offsetMes - 1)}
          disabled={offsetMes === 0}
          aria-label="Mes anterior"
          className="h-11 w-11 rounded-full text-xl enabled:hover:bg-secondary disabled:opacity-30"
        >
          ‹
        </button>
        <p className="font-semibold capitalize">{nombreMes}</p>
        <button
          type="button"
          onClick={() => setOffsetMes(offsetMes + 1)}
          disabled={offsetMes >= MAX_MESES_ADELANTE}
          aria-label="Mes siguiente"
          className="h-11 w-11 rounded-full text-xl enabled:hover:bg-secondary disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-medium opacity-60">
        {DIAS_CORTOS.map((dia) => (
          <span key={dia}>{dia}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: columnaInicial }).map((_, i) => (
          <span key={`vacio-${i}`} />
        ))}
        {Array.from({ length: diasEnMes }).map((_, i) => {
          const dia = new Date(mes.getFullYear(), mes.getMonth(), i + 1)
          const horario = horarioDelDia(dia)
          const deshabilitado = dia < hoy || !horario || horario.cerrado
          const esHoy = dia.getTime() === hoy.getTime()
          const elegida = fecha != null && dia.getTime() === fecha.getTime()

          return (
            <button
              key={i}
              type="button"
              disabled={deshabilitado}
              onClick={() => onElegirFecha(dia)}
              aria-pressed={elegida}
              className={`aspect-square rounded-full text-sm transition-colors disabled:opacity-30 ${
                elegida
                  ? 'bg-primary font-semibold text-white'
                  : 'enabled:hover:bg-secondary'
              } ${esHoy && !elegida ? 'font-bold text-accent underline underline-offset-4' : ''}`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
