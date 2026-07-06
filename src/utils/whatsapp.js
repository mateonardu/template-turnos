import { siteConfig } from '../config/site.config'

function linkWhatsApp(texto) {
  return `https://wa.me/${siteConfig.whatsapp.numero}?text=${encodeURIComponent(texto)}`
}

export function linkConsultaGeneral() {
  return linkWhatsApp(siteConfig.whatsapp.mensajes.consultaGeneral)
}

/**
 * Único lugar que decide adónde va la confirmación de una reserva.
 * Interpola los placeholders {servicio}, {fecha}, {hora}, {nombre}
 * presentes en mensajes.reservaTurno; los que no vengan en `datos`
 * quedan sin reemplazar (señal visible de que falta configurarlos).
 */
export function linkReservaTurno(datos) {
  const texto = siteConfig.whatsapp.mensajes.reservaTurno.replace(
    /\{(\w+)\}/g,
    (marca, clave) => datos[clave] ?? marca,
  )
  return linkWhatsApp(texto)
}
