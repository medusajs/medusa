import { RefObject, useEffect, useState } from "react"

export const useIntersection = (
  element: RefObject<HTMLDivElement | null>,
  rootMargin: string
) => {
  const [isVisible, setState] = useState(false)

  useEffect(() => {
    if (!element.current) {
      return
    }

    const el = element.current

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting)
      },
      { rootMargin }
    )

    observer.observe(el)

    return () => observer.unobserve(el)
  }, [element, rootMargin])

  return isVisible
}
