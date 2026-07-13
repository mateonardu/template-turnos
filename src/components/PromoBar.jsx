import { useEffect, useState } from 'react'
import { siteConfig } from '../config/site.config'
import { linkConsultaGeneral } from '../utils/whatsapp'

const DURACION_TRANSICION_MS = 380
const DURACION_COPIADO_MS = 1800

export default function PromoBar() {
  const { promoBar } = siteConfig
  const mensajes = promoBar?.mensajes ?? []
  const [indice, setIndice] = useState(0)
  const [visible, setVisible] = useState(true)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    if (mensajes.length < 2) return undefined

    const rotar = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndice((i) => (i + 1) % mensajes.length)
        setVisible(true)
        setCopiado(false)
      }, DURACION_TRANSICION_MS)
    }, (promoBar.rotarCadaSegundos ?? 5) * 1000)

    return () => clearInterval(rotar)
  }, [mensajes.length, promoBar?.rotarCadaSegundos])

  if (!promoBar?.activa || mensajes.length === 0) return null

  const mensaje = mensajes[indice]

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(mensaje.cupon)
    } catch {
      // portapapeles no disponible (ej. contexto sin permisos): el badge
      // ya muestra el código igual, así que la clienta puede copiarlo a mano.
    }
    setCopiado(true)
    setTimeout(() => setCopiado(false), DURACION_COPIADO_MS)
  }

  return (
    <div className="relative flex h-11 items-center justify-center overflow-hidden bg-promo-bar px-4 font-ui text-promo-bar-foreground">
      <div
        className="flex min-w-0 items-center gap-2.5 transition-[opacity,transform] duration-[380ms] ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-8px)',
        }}
      >
        <span className="truncate text-[13px] tracking-wide">{mensaje.texto}</span>

        {mensaje.cupon && (
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="rounded-[5px] border border-white/25 bg-white/10 px-2 py-0.5 font-mono text-[11px] tracking-wider">
              {mensaje.cupon}
            </span>
            <button
              type="button"
              onClick={copiarCodigo}
              className={`shrink-0 rounded-[5px] border border-white/30 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors ${
                copiado ? 'bg-exito/40' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {copiado ? '✓ Copiado' : 'Copiar código'}
            </button>
          </span>
        )}
      </div>

      <a
        href={linkConsultaGeneral()}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 hidden text-xs text-promo-bar-foreground/75 underline decoration-1 underline-offset-4 transition-colors hover:text-promo-bar-foreground md:inline"
      >
        WhatsApp
      </a>
    </div>
  )
}
