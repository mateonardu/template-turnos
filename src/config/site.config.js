/**
 * ÚNICO archivo a editar por cliente.
 * Ningún componente debe hardcodear textos, colores, imágenes ni datos:
 * todo sale de acá.
 */

import logoAura from '../assets/logo-aura.svg'
import heroFondo from '../assets/hero-fondo.webp'
import imgLimpieza from '../assets/hero-bg.svg'
import imgCejas from '../assets/hero-bg.svg'
import imgPestanas from '../assets/hero-bg.svg'
import imgManicura from '../assets/hero-bg.svg'

export const siteConfig = {
  marca: {
    nombre: 'Estética Aura',
    slogan: 'Tu momento de belleza y bienestar',
    logo: logoAura,
    heroImagen: heroFondo,
    descripcionCorta:
      'Centro de estética integral en Palermo. Tratamientos faciales, cejas, pestañas y manicura con turnos por WhatsApp.',
  },

  tema: {
    colores: {
      primario: '#b76e79',   // rosa viejo
      secundario: '#f3e5e0', // nude claro
      fondo: '#fdf9f7',
      texto: '#3d2c2e',
      acento: '#8a5a44',     // marrón cálido
    },
    fuenteTitulos: "'Playfair Display', Georgia, serif",
    fuenteTexto: "'Inter', system-ui, sans-serif",
  },

  textos: {
    servicios: {
      titulo: 'Nuestros servicios',
      subtitulo: 'Elegí tu tratamiento y reservá tu turno en un toque.',
    },
    galeria: {
      titulo: 'Nuestro trabajo',
      subtitulo: 'Resultados reales de nuestros tratamientos.',
    },
    testimonios: {
      titulo: 'Lo que dicen nuestras clientas',
      subtitulo: 'Experiencias reales de quienes ya nos visitaron.',
    },
    turnos: {
      titulo: 'Reservá tu turno',
      subtitulo: 'Elegí el servicio, el día y el horario. Te esperamos.',
    },
    ubicacion: {
      titulo: 'Horarios y ubicación',
      subtitulo: 'Vení a conocernos, te esperamos.',
    },
  },

  servicios: [
    {
      id: 'limpieza-facial',
      nombre: 'Limpieza facial profunda',
      descripcion:
        'Higiene, exfoliación, extracción y máscara según tu tipo de piel.',
      duracionMin: 60,
      precio: 28000,
      porcentajeSena: 30,
      imagen: imgLimpieza,
      destacado: true,
    },
    {
      id: 'perfilado-cejas',
      nombre: 'Perfilado de cejas',
      descripcion: 'Diseño y perfilado con henna o laminado, según tu estilo.',
      duracionMin: 45,
      precio: 18000,
      porcentajeSena: 30,
      imagen: imgCejas,
      destacado: true,
    },
    {
      id: 'lifting-pestanas',
      nombre: 'Lifting de pestañas',
      descripcion: 'Curvado y tinte de pestañas naturales, efecto por 6 semanas.',
      duracionMin: 75,
      precio: 24000,
      porcentajeSena: 50,
      imagen: imgPestanas,
      destacado: false,
    },
    {
      id: 'manicura-semi',
      nombre: 'Manicura semipermanente',
      descripcion: 'Esmaltado semipermanente con fortalecimiento de uñas.',
      duracionMin: 60,
      precio: 15000,
      porcentajeSena: 0,
      imagen: imgManicura,
      destacado: false,
    },
  ],

  galeria: [heroFondo, imgLimpieza, imgCejas, imgPestanas],

  testimonios: [
    {
      nombre: 'Camila R.',
      texto:
        'Me hice el lifting de pestañas y quedé fascinada. Súper prolijas y el lugar es divino.',
      servicio: 'Lifting de pestañas',
    },
    {
      nombre: 'Julieta M.',
      texto:
        'La limpieza facial me cambió la piel. Atención de diez y sacar turno por WhatsApp es rapidísimo.',
      servicio: 'Limpieza facial profunda',
    },
    {
      nombre: 'Sofía G.',
      texto: 'Voy todos los meses por las cejas, nunca me fallan con el diseño.',
      servicio: 'Perfilado de cejas',
    },
  ],

  horarios: [
    { dia: 'Lunes', abre: '', cierra: '', cerrado: true },
    { dia: 'Martes', abre: '09:00', cierra: '19:00', cerrado: false },
    { dia: 'Miércoles', abre: '09:00', cierra: '19:00', cerrado: false },
    { dia: 'Jueves', abre: '09:00', cierra: '19:00', cerrado: false },
    { dia: 'Viernes', abre: '09:00', cierra: '20:00', cerrado: false },
    { dia: 'Sábado', abre: '10:00', cierra: '18:00', cerrado: false },
    { dia: 'Domingo', abre: '', cierra: '', cerrado: true },
  ],

  ubicacion: {
    direccion: 'Av. Santa Fe 3456, Piso 1',
    barrio: 'Palermo',
    ciudad: 'Buenos Aires',
    linkGoogleMaps: 'https://maps.google.com/?q=Av.+Santa+Fe+3456+CABA',
  },

  // instagram y tiktok son opcionales: dejar en null si el cliente no tiene.
  redes: {
    instagram: 'https://instagram.com/estetica.aura',
    tiktok: null,
  },

  whatsapp: {
    numero: '5491122334455', // sin "+", formato wa.me
    mensajes: {
      consultaGeneral:
        'Hola! Vi la página de Estética Aura y quiero hacer una consulta.',
      // {servicio}, {fecha}, {hora} y {nombre} se interpolan al confirmar la reserva.
      reservaTurno:
        'Hola! Soy {nombre}. Quiero confirmar mi turno de {servicio} el {fecha} a las {hora} hs.',
    },
  },

  secciones: {
    testimonios: true,
    galeria: true,
    equipo: false,
    promo: true,
  },

  promo: {
    activa: true,
    titulo: '20% OFF en tu primera visita',
    texto: 'Mencioná la promo al reservar por WhatsApp y obtené el descuento en cualquier servicio.',
  },

  // Crédito del desarrollador en el footer.
  creditos: {
    texto: 'Sitio desarrollado por @mateooo.dev',
    url: 'https://mateooo.dev',
  },
}
