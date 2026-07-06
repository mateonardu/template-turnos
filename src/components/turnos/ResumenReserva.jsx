import { formatDuracion, formatFecha, formatPrecio } from '../../utils/format'

export default function ResumenReserva({ servicio, fecha, hora }) {
  const sena =
    servicio.porcentajeSena > 0
      ? Math.round((servicio.precio * servicio.porcentajeSena) / 100)
      : 0

  const filas = [
    ['Servicio', servicio.nombre],
    ['Fecha', formatFecha(fecha)],
    ['Horario', `${hora} hs`],
    ['Duración', formatDuracion(servicio.duracionMin)],
    ['Precio', formatPrecio(servicio.precio)],
  ]
  if (sena > 0) {
    filas.push([`Seña (${servicio.porcentajeSena}%)`, formatPrecio(sena)])
  }

  return (
    <dl className="rounded-xl bg-secondary p-4 text-sm">
      {filas.map(([etiqueta, valor]) => (
        <div key={etiqueta} className="flex justify-between gap-3 py-0.5">
          <dt className="opacity-70">{etiqueta}</dt>
          <dd className="text-right font-medium">{valor}</dd>
        </div>
      ))}
    </dl>
  )
}
