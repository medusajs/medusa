import { RefObject, useEffect } from "react"

type Handler = (event: MouseEvent) => void

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler
): void => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const el = ref?.current

      if (!el || el.contains(event.target as Node)) {
        return
      }

      handler(event)
    }

    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [ref])
}

export default useOnClickOutside
