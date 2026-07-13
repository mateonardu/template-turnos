import { siteConfig } from '../config/site.config'
import { linkConsultaGeneral } from '../utils/whatsapp'

// Tailwind extrae clases del texto fuente tal cual está escrito, así que los
// delays van como literales completos (no se pueden armar con template
// strings interpoladas: Tailwind no vería la clase resultante).
const ANIM_TIMING =
  'animate-[aura-rise_0.8s_both] [animation-timing-function:cubic-bezier(0.22,0.61,0.36,1)]'
const ANIM_0 = `${ANIM_TIMING} [animation-delay:0s]`
const ANIM_12 = `${ANIM_TIMING} [animation-delay:0.12s]`
const ANIM_24 = `${ANIM_TIMING} [animation-delay:0.24s]`
const ANIM_36 = `${ANIM_TIMING} [animation-delay:0.36s]`
const ANIM_50 = `${ANIM_TIMING} [animation-delay:0.5s]`
const ANIM_IMAGEN =
  'animate-[aura-rise_1.1s_both] [animation-timing-function:cubic-bezier(0.22,0.61,0.36,1)]'

export default function Hero() {
  const { marca, textos } = siteConfig
  const { hero } = textos
  const whatsappUrl = linkConsultaGeneral()

  return (
    <section
      id="inicio"
      aria-label={marca.nombre}
      className="relative min-h-[clamp(560px,88vh,860px)] overflow-hidden bg-background"
    >
      <img
        src={marca.heroImagen}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover object-[62%_30%] ${ANIM_IMAGEN}`}
      />

      {/* Degradado de fondo → transparente. Cortes fijos (no %) entre mobile
          y tablet (hasta 1023px) para que nunca quede detrás de la columna
          de texto (max-w 440px); de lg en adelante, % ya es seguro porque
          el contenedor tiene max-width propio. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-fondo)_0px,var(--color-fondo)_560px,transparent_680px)] lg:bg-[linear-gradient(90deg,var(--color-fondo)_0%,var(--color-fondo)_55%,transparent_68%)]"
      />

      <div className="relative mx-auto flex min-h-[clamp(560px,88vh,860px)] max-w-[1240px] items-center px-[clamp(20px,5vw,64px)] py-[clamp(40px,7vh,84px)]">
        <div className="flex max-w-[440px] flex-col justify-center">
          <p
            className={`mb-[18px] text-[12.5px] font-bold tracking-[0.22em] text-primary uppercase ${ANIM_0}`}
          >
            {hero.eyebrow}
          </p>

          <h1
            className={`mb-5 font-heading text-[clamp(36px,5vw,60px)] leading-[1.12] font-semibold tracking-[-0.01em] text-foreground text-balance ${ANIM_12}`}
          >
            {hero.tituloPrincipal}
            <br />
            <em className="text-primary italic">{hero.tituloEnfasis}</em>
          </h1>

          <p
            className={`mb-8 max-w-[48ch] text-[clamp(15.5px,1.4vw,18px)] leading-[1.65] text-foreground/65 text-pretty ${ANIM_24}`}
          >
            {hero.subcopy}
          </p>

          <div className={`flex flex-wrap items-center gap-[18px] ${ANIM_36}`}>
            <a
              href="#turnos"
              className="inline-flex items-center gap-2.5 rounded-full bg-primary px-[34px] py-[17px] text-[16.5px] font-bold text-white shadow-[0_10px_28px_rgba(178,107,124,.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_14px_34px_rgba(178,107,124,.42)]"
            >
              {hero.ctaPrimario}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/60 underline underline-offset-4 transition-colors hover:text-primary"
            >
              {hero.ctaSecundario}
            </a>
          </div>

          <div className={`mt-[34px] flex items-center gap-2.5 text-[13.5px] text-foreground/60 ${ANIM_50}`}>
            <span className="text-sm tracking-[2px] text-estrellas">★★★★★</span>
            <span>
              <strong className="text-foreground">{hero.ratingValor}</strong> {hero.ratingTexto}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`absolute right-[clamp(20px,5vw,64px)] bottom-[clamp(88px,12vh,120px)] flex items-center gap-2 rounded-full bg-white/90 px-4 py-[9px] text-[13px] font-semibold whitespace-nowrap text-foreground shadow-[0_6px_20px_rgba(61,50,54,.12)] backdrop-blur-sm ${ANIM_50}`}
      >
        <span className="h-2 w-2 rounded-full bg-exito" />
        {hero.disponibilidad}
      </div>
    </section>
  )
}
