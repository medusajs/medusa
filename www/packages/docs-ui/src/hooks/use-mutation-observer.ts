import { useEffect } from "react"

type UseMutationObserverProps = {
  elm: Document | HTMLElement | undefined
  callback: () => void
  options?: {
    attributes?: boolean
    characterData?: boolean
    childList?: boolean
    subtree?: boolean
  }
}

export const useMutationObserver = ({
  elm,
  callback,
  options = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  },
}: UseMutationObserverProps) => {
  useEffect(() => {
    if (elm) {
      const observer = new MutationObserver(callback)
      observer.observe(elm, options)
      return () => observer.disconnect()
    }
  }, [callback, options])
}
