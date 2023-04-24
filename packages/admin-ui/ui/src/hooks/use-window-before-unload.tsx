import { useCallback, useEffect } from "react"
import { isBrowser } from "../utils/is-browser"

export interface UseWindowBeforeUnloadParams {
  preventUnload: boolean
}

export const useWindowBeforeUnload = ({
  preventUnload,
}: UseWindowBeforeUnloadParams) => {
  // NOTE: This will not prevent the user from leaving the page if they
  // click a link or button that navigates to a different page w/in
  // the app or if they press the back button.

  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (!preventUnload) return

      event.preventDefault()
      event.returnValue = ""
    },
    [preventUnload]
  )

  useEffect(() => {
    if (!isBrowser) return

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [handleBeforeUnload])
}
