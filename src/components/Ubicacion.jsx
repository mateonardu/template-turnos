import { siteConfig } from '../config/site.config'
import { estadoLocal } from '../utils/horarios'
import { horarioDelDia } from '../utils/slots'

const ETIQUETAS_REDES = { instagram: 'Instagram', tiktok: 'TikTok' }

function IndicadorEstado() {
  const estado = estadoLocal()
  return (
    <p className="flex items-center gap-2 text-sm font-medium">
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 rounded-full ${
          estado.abierto ? 'bg-green-500' : 'bg-red-400'
        }`}
      />
      {estado.abierto ? (
        <>Abierto ahora · cierra {estado.cierra}</>
      ) : estado.abreHora ? (
        <>
          Cerrado ahora · abre {estado.abreDia} {estado.abreHora}
        </>
      ) : (
        <>Cerrado</>
      )}
    </p>
  )
}

export default function Ubicacion() {
  const { titulo, subtitulo } = siteConfig.textos.ubicacion
  const { horarios, ubicacion, redes } = siteConfig
  const diaActual = horarioDelDia(new Date())?.dia
  const redesActivas = Object.entries(redes).filter(([, url]) => url)

  return (
    <section id="ubicacion" className="bg-secondary px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            {titulo}
          </h2>
          <p className="mt-2 opacity-80">{subtitulo}</p>
        </header>

        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <IndicadorEstado />
            <ul className="mt-4 flex flex-col gap-1">
              {horarios.map((h) => (
                <li
                  key={h.dia}
                  className={`flex justify-between rounded-lg px-3 py-2 text-sm ${
                    h.dia === diaActual ? 'bg-white font-semibold' : ''
                  }`}
                >
                  <span>{h.dia}</span>
                  <span className={h.cerrado ? 'opacity-60' : ''}>
                    {h.cerrado ? 'Cerrado' : `${h.abre} – ${h.cierra}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <address className="not-italic">
              <p className="text-lg font-medium">{ubicacion.direccion}</p>
              <p className="mt-1 text-sm opacity-80">
                {ubicacion.barrio}, {ubicacion.ciudad}
              </p>
            </address>

            <a
              href={ubicacion.linkGoogleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Cómo llegar
            </a>

            {redesActivas.length > 0 && (
              <div className="mt-6 flex gap-5">
                {redesActivas.map(([red, url]) => (
                  <a
                    key={red}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium underline underline-offset-4 transition-colors hover:text-accent"
                  >
                    {ETIQUETAS_REDES[red] ?? red}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
