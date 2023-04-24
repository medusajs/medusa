import { useEffect } from "react"
import { isBrowser } from "../../../utils/is-browser"

export const useLivePreviewClick = (
  onPostSectionClick: (postId: string) => void
) => {
  const messageHandler = (event: MessageEvent) => {
    if (!isBrowser) return

    const iframe = document.getElementById(
      "preview-window"
    ) as HTMLIFrameElement

    if (!iframe) return

    if (event.source !== iframe.contentWindow) return

    onPostSectionClick(event.data?.payload?.postSectionId)
  }

  useEffect(() => {
    if (!isBrowser) return

    window.addEventListener("message", messageHandler)

    return () => {
      window.removeEventListener("message", messageHandler)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPostSectionClick])
}
