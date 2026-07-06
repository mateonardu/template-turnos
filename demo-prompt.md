Vamos a personalizar este template para una demo comercial de un negocio real. REGLA ABSOLUTA: solo se edita src/config/site.config.js y se agregan imágenes a src/assets. NO se toca ningún componente, ni estilos, ni lógica. Si algo del pedido pareciera requerir tocar componentes, avisame antes de hacerlo.

Datos del negocio:
- Nombre: [nombre]
- Rubro: [estética / barbería / nails / pestañas y cejas]
- Slogan: [si tiene en su bio, usarlo; si no, proponé uno corto y creíble para el rubro, sin grandilocuencia]
- Paleta: [colores dominantes de su feed/logo, en hex si los tengo; si no: "proponé una paleta acorde a: (describir estética del feed: ej. negro y dorado masculino / rosa empolvado minimalista)"]
- Tipografías: elegí un par (títulos + texto) coherente con esa estética, de Google Fonts.
- Servicios (nombre, duración estimada, precio, seña): 
  [lista sacada de su feed/historias; si no publican precios, usá precios de mercado razonables para el rubro y la zona]
- Dirección: [de su bio/Google Maps]
- Horarios: [de Google Maps o su bio; si no hay datos, martes a sábado 9-19]
- Instagram: [handle]
- WhatsApp: usá el placeholder 5491100000000 (NUNCA el número real del negocio en una demo)
- Textos: adaptá títulos y subtítulos de secciones al rubro (una barbería no dice "Tu momento de belleza": ajustá el tono).
- Testimonios: redactá 3 verosímiles para el rubro usando nombres de pila comunes, mencionando servicios reales de la lista.
- Promo: [si tiene una promo visible en su feed, usarla; si no, secciones.promo en false]
- Fotos: voy a guardar en src/assets las imágenes con estos nombres: hero-fondo.jpg, servicio-1.jpg, servicio-2.jpg [...], galeria-1.jpg [...]. Conectalas donde corresponda en el config.

Al final, revisá que no haya quedado ningún dato de "Estética Aura" en el config.