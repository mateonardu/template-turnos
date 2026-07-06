import { useEffect, useRef, useState } from 'react'
import { siteConfig } from '../../config/site.config'
import { useTurnos } from './TurnosContext'
import PasoServicio from './PasoServicio'
import PasoFecha from './PasoFecha'
import PasoHorario from './PasoHorario'
import PasoDatos, { validarDatos } from './PasoDatos'
import PagoSimulado from './PagoSimulado'
import Confirmacion from './Confirmacion'

const PASOS = ['Servicio', 'Fecha', 'Horario', 'Tus datos']
const DATOS_INICIALES = { nombre: '', telefono: '', email: '' }

function IndicadorPasos({ actual }) {
  return (
    <div className="mb-6">
      <p className="text-sm opacity-70">
        Paso {actual} de {PASOS.length}:{' '}
        <span className="font-semibold opacity-100">{PASOS[actual - 1]}</span>
      </p>
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
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

export default function Turnos() {
  const { titulo, subtitulo } = siteConfig.textos.turnos
  const { servicio, elegirServicio } = useTurnos()
  const [paso, setPaso] = useState(1)
  const [fecha, setFecha] = useState(null)
  const [hora, setHora] = useState(null)
  const [datos, setDatos] = useState(DATOS_INICIALES)
  const [errores, setErrores] = useState({})
  // 'pasos' (wizard 1-4) → 'pago' (checkout simulado, solo con seña) → 'confirmada'
  const [etapa, setEtapa] = useState('pasos')
  const tarjetaRef = useRef(null)

  // Al cambiar de etapa la tarjeta se achica de golpe y el scroll quedaría
  // apuntando a las secciones de abajo: re-encuadramos el wizard.
  useEffect(() => {
    if (etapa !== 'pasos') {
      tarjetaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [etapa])

  // Si cambia el servicio (acá o desde una card), el horario elegido deja
  // de valer: los slots se recalculan con la nueva duración. Si ya se había
  // avanzado más allá del paso de horario, se vuelve a él.
  useEffect(() => {
    setHora(null)
    setEtapa('pasos')
    setPaso((p) => (p === 4 ? 3 : p))
  }, [servicio?.id])

  const elegirFecha = (nuevaFecha) => {
    setFecha(nuevaFecha)
    setHora(null)
  }

  const cambiarDato = (clave, valor) => {
    setDatos((d) => ({ ...d, [clave]: valor }))
    setErrores(({ [clave]: _corregido, ...resto }) => resto)
  }

  const confirmarReserva = () => {
    const nuevosErrores = validarDatos(datos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length === 0) {
      // Con seña: primero el checkout simulado; sin seña: confirmación directa.
      setEtapa(servicio.porcentajeSena > 0 ? 'pago' : 'confirmada')
    }
  }

  const reiniciar = () => {
    elegirServicio(null)
    setPaso(1)
    setFecha(null)
    setHora(null)
    setDatos(DATOS_INICIALES)
    setErrores({})
    setEtapa('pasos')
  }

  const puedeContinuar =
    (paso === 1 && servicio != null) ||
    (paso === 2 && fecha != null) ||
    (paso === 3 && hora != null)

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
          ) : etapa === 'pago' ? (
            <PagoSimulado
              servicio={servicio}
              onPagado={() => setEtapa('confirmada')}
            />
          ) : (
            <>
              <IndicadorPasos actual={paso} />

              {paso === 1 && <PasoServicio />}
              {paso === 2 && (
                <PasoFecha fecha={fecha} onElegirFecha={elegirFecha} />
              )}
              {paso === 3 && (
                <PasoHorario
                  servicio={servicio}
                  fecha={fecha}
                  hora={hora}
                  onElegirHora={setHora}
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
                {paso > 1 && (
                  <button
                    type="button"
                    onClick={() => setPaso(paso - 1)}
                    className="rounded-full border-2 border-secondary px-6 py-3 font-semibold transition-colors hover:bg-secondary"
                  >
                    Volver
                  </button>
                )}
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
                    className="flex-1 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Confirmar reserva
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
