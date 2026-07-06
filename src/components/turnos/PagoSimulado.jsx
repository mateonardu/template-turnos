import { useState } from 'react'
import { formatPrecio } from '../../utils/format'

const DEMORA_PAGO_MS = 1500

/**
 * Checkout simulado para la demo. Estética neutra de pasarela de pago
 * (grises, a propósito fuera de la paleta del tema) para que se sienta
 * como un "pago seguro" externo al sitio.
 */
export default function PagoSimulado({ servicio, onPagado }) {
  const [procesando, setProcesando] = useState(false)
  const sena = Math.round((servicio.precio * servicio.porcentajeSena) / 100)

  const pagar = () => {
    setProcesando(true)
    setTimeout(onPagado, DEMORA_PAGO_MS)
  }

  return (
    <div className="text-center">
      <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-neutral-500">
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="4" y="11" width="16" height="9" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Pago seguro
      </p>

      <h3 className="mt-4 text-lg font-semibold text-neutral-800">
        Seña para {servicio.nombre}
      </h3>
      <p className="mt-2 text-4xl font-bold text-neutral-900">
        {formatPrecio(sena)}
      </p>
      <p className="mt-1 text-sm text-neutral-500">
        {servicio.porcentajeSena}% del valor del servicio
      </p>

      <button
        type="button"
        onClick={pagar}
        disabled={procesando}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-800 py-3 font-semibold text-white transition-opacity enabled:hover:opacity-90 disabled:opacity-70"
      >
        {procesando ? (
          <>
            <span
              aria-hidden="true"
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
            Procesando…
          </>
        ) : (
          `Pagar ${formatPrecio(sena)}`
        )}
      </button>

      <p className="mt-3 text-xs text-neutral-400">
        Simulación de pago — no se realiza ningún cargo.
      </p>
    </div>
  )
}
