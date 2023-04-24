import { isBrowser } from "../../../utils/is-browser"

export const updateLivePreviewActiveSection = (postSectionId?: string) => {
  if (!isBrowser) return

  const iframe = document.getElementById("preview-window") as HTMLIFrameElement

  if (!iframe) return

  iframe.contentWindow?.postMessage(
    { type: "SetActivePostSection", payload: { postSectionId } },
    "*"
  )
}
