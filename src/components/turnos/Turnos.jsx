import { useEffect, useRef, useState } from 'react'
import { siteConfig } from '../../config/site.config'
import { crearTurno, getServicios } from '../../services/api'
import { formatFechaISO } from '../../utils/format'
import { useTurnos } from './TurnosContext'
import PasoFecha from './PasoFecha'
import PasoHorario from './PasoHorario'
import PasoDatos, { validarDatos } from './PasoDatos'
import Confirmacion from './Confirmacion'

const PASOS = ['Servicio', 'Fecha', 'Horario', 'Tus datos']
const DATOS_INICIALES = { nombre: '', telefono: '', email: '' }

function irAServicios() {
  document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function IndicadorPasos({ actual, servicio, onCambiar }) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm opacity-70">
          Paso {actual} de {PASOS.length}:{' '}
          <span className="font-semibold opacity-100">{PASOS[actual - 1]}</span>
        </p>
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary py-1.5 pr-1.5 pl-3 text-sm font-medium">
          {servicio.nombre}
          <button
            type="button"
            onClick={onCambiar}
            className="rounded-full border border-white bg-white px-2.5 py-1 text-xs font-bold text-primary transition-colors hover:border-primary/40"
          >
            Cambiar
          </button>
        </span>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {PASOS.map((nombre, i) => (
          <span
            key={nombre}
            className={`h-1.5 flex-1 rounded-full ${
              i < actual ? 'bg-primary' : 'bg-secondary'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function EstadoVacio() {
  const { estadoVacioTitulo, estadoVacioTexto, estadoVacioBoton } = siteConfig.textos.turnos

  return (
    <div className="py-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary font-body text-xl text-primary">
        1
      </div>
      <p className="font-heading text-xl font-semibold">{estadoVacioTitulo}</p>
      <p className="mx-auto mt-2 max-w-xs text-sm opacity-70">{estadoVacioTexto}</p>
      <button
        type="button"
        onClick={irAServicios}
        className="mt-5 rounded-full border-2 border-secondary px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
      >
        {estadoVacioBoton}
      </button>
    </div>
  )
}

export default function Turnos() {
  const { titulo, subtitulo } = siteConfig.textos.turnos
  const { servicio, elegirServicio } = useTurnos()
  const [paso, setPaso] = useState(2)
  const [fecha, setFecha] = useState(null)
  const [hora, setHora] = useState(null)
  const [datos, setDatos] = useState(DATOS_INICIALES)
  const [errores, setErrores] = useState({})
  // 'pasos' (wizard 2-4) → 'confirmada' (solo sin seña; con seña se
  // redirige a MercadoPago y la confirmación vive en /turnos/success)
  const [etapa, setEtapa] = useState('pasos')
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState(null)
  const [avisoSlot, setAvisoSlot] = useState(null)
  const [serviciosApi, setServiciosApi] = useState(null)
  const tarjetaRef = useRef(null)

  // Servicios reales de la BD: hacen falta para reconciliar el servicio
  // elegido desde una card (que viene del id string del config) con su
  // equivalente real, cuyo id numérico espera la API al crear el turno.
  useEffect(() => {
    getServicios()
      .then(setServiciosApi)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!serviciosApi || !servicio) return
    if (serviciosApi.some((s) => s.id === servicio.id)) return
    const real = serviciosApi.find((s) => s.nombre === servicio.nombre)
    elegirServicio(real ?? null)
  }, [serviciosApi, servicio, elegirServicio])

  // Al cambiar de etapa la tarjeta se achica de golpe y el scroll quedaría
  // apuntando a las secciones de abajo: re-encuadramos el wizard.
  useEffect(() => {
    if (etapa !== 'pasos') {
      tarjetaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [etapa])

  // Selección nueva de servicio (desde una card, o cambiando de una a
  // otra): arranca el wizard limpio, directo en el paso de Fecha. Se
  // dispara por nombre y no por id para no reiniciar el progreso cuando
  // lo único que cambia es el id real reconciliado arriba (mismo servicio).
  useEffect(() => {
    if (!servicio) return
    setFecha(null)
    setHora(null)
    setDatos(DATOS_INICIALES)
    setErrores({})
    setAvisoSlot(null)
    setEtapa('pasos')
    setPaso(2)
  }, [servicio?.nombre])

  const elegirFecha = (nuevaFecha) => {
    setFecha(nuevaFecha)
    setHora(null)
    setAvisoSlot(null)
  }

  const cambiarDato = (clave, valor) => {
    setDatos((d) => ({ ...d, [clave]: valor }))
    setErrores(({ [clave]: _corregido, ...resto }) => resto)
  }

  const confirmarReserva = async () => {
    const nuevosErrores = validarDatos(datos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    setEnviando(true)
    setErrorEnvio(null)
    try {
      const { mpInitPoint } = await crearTurno({
        servicioId: servicio.id,
        fecha: formatFechaISO(fecha),
        horaInicio: hora,
        nombreCliente: datos.nombre.trim(),
        telefonoCliente: datos.telefono.trim(),
        emailCliente: datos.email.trim() || undefined,
      })

      if (mpInitPoint) {
        // Con seña: checkout real de MercadoPago. La confirmación
        // sigue en /turnos/success cuando MP redirige de vuelta.
        window.location.href = mpInitPoint
        return
      }
      // Sin seña: el backend ya lo confirmó.
      setEtapa('confirmada')
    } catch (error) {
      if (error.status === 409) {
        // Otro cliente ganó el slot mientras completaba sus datos.
        setHora(null)
        setAvisoSlot('Ese horario ya fue reservado. Elegí otro horario.')
        setPaso(3)
      } else {
        setErrorEnvio('No pudimos procesar tu reserva. Intentá de nuevo.')
      }
    } finally {
      setEnviando(false)
    }
  }

  const reiniciar = () => {
    elegirServicio(null)
    setPaso(2)
    setFecha(null)
    setHora(null)
    setDatos(DATOS_INICIALES)
    setErrores({})
    setEtapa('pasos')
  }

  // Deselecciona el servicio y vuelve a la sección de tarjetas: lo usan
  // tanto el botón "Cambiar" del chip como el estado vacío.
  const cambiarServicio = () => {
    elegirServicio(null)
    setFecha(null)
    setHora(null)
    setDatos(DATOS_INICIALES)
    setErrores({})
    setEtapa('pasos')
    irAServicios()
  }

  const puedeContinuar =
    (paso === 2 && fecha != null) || (paso === 3 && hora != null)

  return (
    <section id="turnos" className="px-6 py-16">
      <div className="mx-auto max-w-xl">
        <header className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            {titulo}
          </h2>
          <p className="mt-2 opacity-80">{subtitulo}</p>
        </header>

        <div
          ref={tarjetaRef}
          className="scroll-mt-24 rounded-3xl bg-white p-5 shadow-md sm:p-8"
        >
          {etapa === 'confirmada' ? (
            <Confirmacion
              servicio={servicio}
              fecha={fecha}
              hora={hora}
              datos={datos}
              onReiniciar={reiniciar}
            />
          ) : !servicio ? (
            <EstadoVacio />
          ) : (
            <>
              <IndicadorPasos actual={paso} servicio={servicio} onCambiar={cambiarServicio} />

              {paso === 2 && (
                <PasoFecha fecha={fecha} onElegirFecha={elegirFecha} />
              )}
              {paso === 3 && (
                <PasoHorario
                  servicio={servicio}
                  fecha={fecha}
                  hora={hora}
                  onElegirHora={(h) => {
                    setHora(h)
                    setAvisoSlot(null)
                  }}
                  aviso={avisoSlot}
                />
              )}
              {paso === 4 && (
                <PasoDatos
                  servicio={servicio}
                  fecha={fecha}
                  hora={hora}
                  datos={datos}
                  errores={errores}
                  onCambiar={cambiarDato}
                />
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => (paso === 2 ? cambiarServicio() : setPaso(paso - 1))}
                  className="rounded-full border-2 border-secondary px-6 py-3 font-semibold transition-colors hover:bg-secondary"
                >
                  Volver
                </button>
                {paso < 4 ? (
                  <button
                    type="button"
                    disabled={!puedeContinuar}
                    onClick={() => setPaso(paso + 1)}
                    className="flex-1 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-opacity enabled:hover:opacity-90 disabled:opacity-40"
                  >
                    Continuar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={confirmarReserva}
                    disabled={enviando}
                    className="flex-1 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-opacity enabled:hover:opacity-90 disabled:opacity-70"
                  >
                    {enviando
                      ? 'Procesando...'
                      : servicio?.porcentajeSena > 0
                        ? 'Continuar al pago'
                        : 'Confirmar reserva'}
                  </button>
                )}
              </div>

              {errorEnvio && (
                <p className="mt-3 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
                  {errorEnvio}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
