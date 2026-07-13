import { useEffect, useRef, useState } from 'react'

/**
 * `visible` pasa a `true` la primera vez que el elemento referenciado
 * entra en el viewport y se queda así (el observer se desconecta):
 * la animación de entrada dispara una sola vez por elemento.
 */
export function useReveal({ threshold = 0.12 } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, visible]
}
