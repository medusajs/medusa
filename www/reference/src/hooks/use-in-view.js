import { useEffect, useRef, useState } from "react"

const useInView = options => {
  const containerRef = useRef(null)
  const [isInView, setIsInView] = useState(false)

  const callback = entries => {
    const [entry] = entries
    setIsInView(entry.isIntersecting)
  }

  useEffect(() => {
    const ref = containerRef.current
    const observer = new IntersectionObserver(callback, options)
    if (ref) {
      observer.observe(ref)
    }

    return () => {
      if (ref) {
        observer.unobserve(ref)
      }
    }
  }, [containerRef, options])

  return [containerRef, isInView]
}

export default useInView
