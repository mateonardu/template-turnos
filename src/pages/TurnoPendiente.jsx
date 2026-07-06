import { siteConfig } from '../config/site.config'
import { linkConsultaGeneral } from '../utils/whatsapp'
import LayoutResultado from './LayoutResultado'

/**
 * MP redirige acá con medios de pago de acreditación diferida
 * (ej: efectivo). El turno queda pendiente hasta que se acredite.
 */
export default function TurnoPendiente() {
  return (
    <LayoutResultado>
      <h1 className="font-heading text-2xl font-bold">
        Tu pago está siendo procesado
      </h1>
      <p className="mt-2 text-sm opacity-80">
        Elegiste un medio de pago que puede demorar en acreditarse. Apenas se
        confirme, tu turno queda reservado y te contactamos. Si tenés dudas,
        escribinos por WhatsApp con tu nombre.
      </p>
      <a
        href={linkConsultaGeneral()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 block w-full rounded-full bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
      >
        Escribir a {siteConfig.marca.nombre}
      </a>
    </LayoutResultado>
  )
}
