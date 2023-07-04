import { MutableRefObject, useEffect, useRef, useState } from "react"

export const useObserveWidth = (ref: MutableRefObject<any>): number => {
  const [currentWidth, setCurrentWidth] = useState(0)

  const observer = useRef(
    new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect

      setCurrentWidth(width)
    })
  )

  useEffect(() => {
    const currentRef = ref.current
    const currentObserver = observer.current

    if (currentRef && currentObserver) {
      currentObserver.observe(currentRef)
    }

    return () => {
      if (currentObserver && currentRef) {
        currentObserver.unobserve(currentRef)
      }
    }
  }, [ref, observer])

  return currentWidth
}
