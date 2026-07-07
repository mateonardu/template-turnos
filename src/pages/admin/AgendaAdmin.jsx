import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cancelarTurno, getAdminTurnos } from '../../services/api'
import { formatFechaISO, formatPrecio } from '../../utils/format'
import { useAdmin } from '../../context/AdminContext'
import LayoutAdmin from './LayoutAdmin'

const ESTILO_ESTADO = {
  confirmado: 'bg-green-100 text-green-700',
  pendiente: 'bg-amber-100 text-amber-700',
  cancelado: 'bg-gray-200 text-gray-500',
}

export default function AgendaAdmin() {
  return (
    <LayoutAdmin titulo="Agenda">
      <Agenda />
    </LayoutAdmin>
  )
}

function Agenda() {
  const { token, logout } = useAdmin()
  const [fecha, setFecha] = useState(() => formatFechaISO(new Date()))
  const [turnos, setTurnos] = useState(null)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setError(null)
    setTurnos(null)
    try {
      setTurnos(await getAdminTurnos(fecha, undefined, token))
    } catch (err) {
      if (err.status === 401) return logout()
      setError('No pudimos cargar la agenda. Probá de nuevo.')
    }
  }, [fecha, token, logout])

  useEffect(() => {
    cargar()
  }, [cargar])

  const cancelar = async (turno) => {
    const ok = window.confirm(
      `¿Cancelar el turno de ${turno.nombreCliente} a las ${turno.horaInicio}?`
    )
    if (!ok) return
    try {
      await cancelarTurno(turno.id, token)
      cargar()
    } catch (err) {
      if (err.status === 401) return logout()
      window.alert(err.message)
    }
  }

  return (
    <div>
      <label className="block">
        <span className="text-sm font-medium">Fecha</span>
        <input
          type="date"
          value={fecha}
          onChange={(e) => e.target.value && setFecha(e.target.value)}
          className="mt-1 w-full rounded-xl border-2 border-secondary p-3 outline-none transition-colors focus:border-primary"
        />
      </label>

      {error ? (
        <div className="mt-6 rounded-xl bg-secondary p-4 text-center text-sm">
          <p>{error}</p>
          <button
            type="button"
            onClick={cargar}
            className="mt-3 rounded-full bg-primary px-6 py-2 font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      ) : !turnos ? (
        <p role="status" className="mt-6 text-center text-sm opacity-70">
          Cargando agenda...
        </p>
      ) : turnos.length === 0 ? (
        <p className="mt-6 rounded-xl bg-secondary p-4 text-center text-sm">
          Sin turnos para este día.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {turnos.map((turno) => (
            <li key={turno.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">
                    {turno.horaInicio}–{turno.horaFin}
                  </p>
                  <p className="text-sm">{turno.servicio.nombre}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${ESTILO_ESTADO[turno.estado] ?? ''}`}
                >
                  {turno.estado}
                </span>
              </div>

              <p className="mt-2 text-sm">
                {turno.nombreCliente} ·{' '}
                <a href={`tel:${turno.telefonoCliente}`} className="font-medium text-primary underline">
                  {turno.telefonoCliente}
                </a>
              </p>
              <p className="mt-0.5 text-xs opacity-70">
                Total {formatPrecio(turno.montoTotal)} · Seña {formatPrecio(turno.montoSena)}
              </p>

              {(turno.estado === 'confirmado' || turno.estado === 'pendiente') && (
                <button
                  type="button"
                  onClick={() => cancelar(turno)}
                  className="mt-3 w-full rounded-full border-2 border-red-200 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  Cancelar turno
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/admin/bloqueos"
        className="mt-6 block rounded-full border-2 border-secondary py-3 text-center font-semibold transition-colors hover:bg-secondary"
      >
        Días bloqueados →
      </Link>
    </div>
  )
}
