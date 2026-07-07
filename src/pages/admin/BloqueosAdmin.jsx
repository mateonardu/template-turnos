import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { crearBloqueo, eliminarBloqueo, getBloqueos } from '../../services/api'
import { formatFecha, formatFechaISO } from '../../utils/format'
import { useAdmin } from '../../context/AdminContext'
import LayoutAdmin from './LayoutAdmin'

export default function BloqueosAdmin() {
  return (
    <LayoutAdmin titulo="Días bloqueados">
      <Bloqueos />
    </LayoutAdmin>
  )
}

function Bloqueos() {
  const { token, logout } = useAdmin()
  const [bloqueos, setBloqueos] = useState(null)
  const [error, setError] = useState(null)
  const [fecha, setFecha] = useState('')
  const [motivo, setMotivo] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cargar = useCallback(async () => {
    setError(null)
    setBloqueos(null)
    try {
      setBloqueos(await getBloqueos(token))
    } catch (err) {
      if (err.status === 401) return logout()
      setError('No pudimos cargar los bloqueos. Probá de nuevo.')
    }
  }, [token, logout])

  useEffect(() => {
    cargar()
  }, [cargar])

  const agregar = async (e) => {
    e.preventDefault()
    if (!fecha) return
    setEnviando(true)
    try {
      await crearBloqueo(fecha, motivo, token)
      setFecha('')
      setMotivo('')
      cargar()
    } catch (err) {
      if (err.status === 401) return logout()
      window.alert(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const eliminar = async (bloqueo) => {
    const ok = window.confirm(
      `¿Quitar el bloqueo del ${formatFecha(new Date(bloqueo.fecha))}?`
    )
    if (!ok) return
    try {
      await eliminarBloqueo(bloqueo.id, token)
      cargar()
    } catch (err) {
      if (err.status === 401) return logout()
      window.alert(err.message)
    }
  }

  return (
    <div>
      <form onSubmit={agregar} className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="font-semibold">Bloquear un día</p>
        <p className="text-xs opacity-70">
          Ese día no se van a poder reservar turnos.
        </p>
        <label className="mt-3 block">
          <span className="text-sm font-medium">Fecha</span>
          <input
            type="date"
            value={fecha}
            min={formatFechaISO(new Date())}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border-2 border-secondary p-3 outline-none transition-colors focus:border-primary"
          />
        </label>
        <label className="mt-3 block">
          <span className="text-sm font-medium">Motivo (opcional)</span>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Feriado, vacaciones..."
            className="mt-1 w-full rounded-xl border-2 border-secondary p-3 outline-none transition-colors focus:border-primary"
          />
        </label>
        <button
          type="submit"
          disabled={enviando || !fecha}
          className="mt-4 w-full rounded-full bg-primary px-6 py-3 font-semibold text-white transition-opacity enabled:hover:opacity-90 disabled:opacity-40"
        >
          {enviando ? 'Agregando...' : 'Agregar bloqueo'}
        </button>
      </form>

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
      ) : !bloqueos ? (
        <p role="status" className="mt-6 text-center text-sm opacity-70">
          Cargando bloqueos...
        </p>
      ) : bloqueos.length === 0 ? (
        <p className="mt-6 rounded-xl bg-secondary p-4 text-center text-sm">
          No hay días bloqueados.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {bloqueos.map((bloqueo) => (
            <li
              key={bloqueo.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm"
            >
              <div>
                <p className="text-sm font-semibold capitalize">
                  {formatFecha(new Date(bloqueo.fecha))}
                </p>
                {bloqueo.motivo && (
                  <p className="text-xs opacity-70">{bloqueo.motivo}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => eliminar(bloqueo)}
                className="shrink-0 rounded-full border-2 border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/admin/agenda"
        className="mt-6 block rounded-full border-2 border-secondary py-3 text-center font-semibold transition-colors hover:bg-secondary"
      >
        ← Volver a la agenda
      </Link>
    </div>
  )
}
