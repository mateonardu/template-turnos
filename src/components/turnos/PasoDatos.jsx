import ResumenReserva from './ResumenReserva'

export function validarDatos({ nombre, telefono, email }) {
  const errores = {}
  if (!nombre.trim()) {
    errores.nombre = 'Ingresá tu nombre.'
  }
  if (!/^\d{8,13}$/.test(telefono.trim())) {
    errores.telefono = 'Solo números, entre 8 y 13 dígitos. Ej: 1165879123'
  }
  if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
    errores.email = 'Revisá el formato del email. Ej: nombre@mail.com'
  }
  return errores
}

const CAMPOS = [
  { clave: 'nombre', etiqueta: 'Nombre', tipo: 'text', autoComplete: 'name' },
  {
    clave: 'telefono',
    etiqueta: 'Teléfono',
    tipo: 'tel',
    inputMode: 'numeric',
    autoComplete: 'tel',
  },
  {
    clave: 'email',
    etiqueta: 'Email (opcional)',
    tipo: 'email',
    inputMode: 'email',
    autoComplete: 'email',
  },
]

export default function PasoDatos({
  servicio,
  fecha,
  hora,
  datos,
  errores,
  onCambiar,
}) {
  return (
    <div>
      <ResumenReserva servicio={servicio} fecha={fecha} hora={hora} />

      <div className="mt-5 flex flex-col gap-4">
        {CAMPOS.map(({ clave, etiqueta, tipo, inputMode, autoComplete }) => (
          <label key={clave} className="block">
            <span className="text-sm font-medium">{etiqueta}</span>
            <input
              type={tipo}
              inputMode={inputMode}
              autoComplete={autoComplete}
              value={datos[clave]}
              onChange={(e) => onCambiar(clave, e.target.value)}
              aria-invalid={Boolean(errores[clave])}
              className={`mt-1 w-full rounded-xl border-2 p-3 outline-none transition-colors focus:border-primary ${
                errores[clave] ? 'border-red-400' : 'border-secondary'
              }`}
            />
            {errores[clave] && (
              <p className="mt-1 text-sm text-red-600">{errores[clave]}</p>
            )}
          </label>
        ))}
      </div>
    </div>
  )
}
