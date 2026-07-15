/**
 * ÚNICO archivo a editar por cliente.
 * Ningún componente debe hardcodear textos, colores, imágenes ni datos:
 * todo sale de acá.
 */

import logoAura from '../assets/logo-aura.svg'
import heroFondo from '../assets/hero-fondo.webp'
import imgLimpieza from '../assets/limpieza.webp'
import imgCejas from '../assets/cejas.webp'
import imgPestanas from '../assets/lifting-pestanas.webp'
import imgManicura from '../assets/manicura.webp'

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
      primarioHover: '#9e5a6c',
      secundario: '#f3e5e0', // nude claro
      fondo: '#fdf9f7',
      texto: '#3d2c2e',
      acento: '#8a5a44',     // marrón cálido
      promoBarFondo: '#4a353b',
      promoBarTexto: '#f6eae6',
      exito: '#5fa97c',
      estrellas: '#c9973f',
      footerFondo: '#3a2c2f',
      footerTexto: '#d9c8c3',
    },
    fuenteTitulos: "'Playfair Display', Georgia, serif",
    fuenteTexto: "'Inter', system-ui, sans-serif",
    fuenteUI: "'Karla', system-ui, sans-serif",
  },

  textos: {
    hero: {
      eyebrow: 'Estética facial · Palermo, Buenos Aires',
      tituloPrincipal: 'Tu piel en manos expertas.',
      tituloEnfasis: 'Tu turno, online en un minuto.',
      subcopy:
        'Cinco años cuidando rostros en Palermo. Elegí tu tratamiento, el día y la hora directo desde acá, sin mensajes, sin espera.',
      ctaPrimario: 'Reservar turno online →',
      disponibilidad: 'Hoy hay turnos disponibles',
      ratingValor: '4,9',
      ratingTexto: 'en Google · más de 500 clientas nos eligen',
    },
    servicios: {
      titulo: 'Nuestros servicios',
      subtitulo: 'Elegí tu tratamiento y reservá tu turno en un toque.',
      badgeDestacado: 'Más pedido',
      cta: 'Elegir día y hora →',
    },
    galeria: {
      titulo: 'Nuestro trabajo',
      subtitulo: 'Resultados reales de nuestros tratamientos.',
      tabGrilla: 'Grilla',
      tabCarrusel: 'Carrusel',
      hintCarrusel: 'Deslizá para ver más →',
    },
    testimonios: {
      titulo: 'Lo que dicen nuestras clientas',
      subtitulo: 'Experiencias reales de quienes ya nos visitaron.',
    },
    turnos: {
      titulo: 'Reservá tu turno',
      subtitulo: 'Elegí el servicio, el día y el horario. Te esperamos.',
      estadoVacioTitulo: 'Empezá eligiendo un tratamiento',
      estadoVacioTexto:
        'Tocá una de las tarjetas de arriba y seguís acá con el día y el horario.',
      estadoVacioBoton: 'Ver tratamientos ↑',
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

  // `alto` es el peso relativo de cada foto en la grilla asimétrica
  // (masonry): a mayor valor, más alta la tarjeta.
  galeria: [
    { imagen: imgLimpieza, alto: 340 },
    { imagen: imgCejas, alto: 260 },
    { imagen: imgPestanas, alto: 400 },
    { imagen: heroFondo, alto: 300 },
    { imagen: imgManicura, alto: 360 },
  ],

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
        'Hola, tenía una consulta sobre los servicios',
      // {servicio}, {fecha}, {hora} y {nombre} se interpolan al confirmar la reserva.
      reservaTurno:
        'Hola! Soy {nombre}. Quiero confirmar mi turno de {servicio} el {fecha} a las {hora} hs.',
    },
  },

  secciones: {
    testimonios: true,
    galeria: false,
    equipo: false,
    promo: true,
  },

  promo: {
    activa: true,
    titulo: '10% OFF en tu primera reserva online',
    texto: 'Reservá tu turno online y obtené el descuento en tu primera visita.',
  },

  // Barra fija de promociones, arriba del todo. Rota entre los mensajes cada
  // `rotarCadaSegundos`. El cupón es opcional: si un mensaje no lo trae, no
  // se muestra el badge ni el botón de copiar.
  promoBar: {
    activa: true,
    rotarCadaSegundos: 5,
    mensajes: [
      {
        texto: '20% OFF en tu primera visita, reservando online',
        cupon: 'AURA20',
      },
      {
        texto: 'Martes de cejas: 2x1 en perfilado reservando online',
        cupon: 'CEJAS2X1',
      },
      {
        texto: 'Este mes: 15% en limpiezas faciales profundas',
        cupon: 'GLOW15',
      },
    ],
  },

  // Crédito del desarrollador en el footer.
  creditos: {
    texto: 'Sitio desarrollado por @mateooo.dev',
    url: 'https://mateooo.dev',
  },
}
