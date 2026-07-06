import { Link } from 'react-router-dom'
import LayoutResultado from './LayoutResultado'

/** MP redirige acá cuando el pago falla o se cancela. */
export default function TurnoError() {
  return (
    <LayoutResultado>
      <h1 className="font-heading text-2xl font-bold">
        Hubo un problema con el pago
      </h1>
      <p className="mt-2 text-sm opacity-80">
        No se realizó ningún cargo. Podés intentar de nuevo — tu horario se
        libera automáticamente en unos minutos si no se completa el pago.
      </p>
      <Link
        to="/#turnos"
        className="mt-5 block w-full rounded-full bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
      >
        Volver a intentar
      </Link>
    </LayoutResultado>
  )
}
