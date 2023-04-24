import { Post } from "@medusajs/medusa"
import { isBrowser } from "../../../utils/is-browser"
import { PostSectionFormValues } from "../components/molecules/post-sections-editor/types"

export const updateLivePreviewPostData = (payload: {
  post: Post
  sections?: (Partial<PostSectionFormValues> & { id: string })[]
  sectionIndex?: number
}) => {
  if (!isBrowser) return

  const iframe = document.getElementById("preview-window") as HTMLIFrameElement

  if (!iframe) return

  iframe.contentWindow?.postMessage({ type: "UpdatePostSection", payload }, "*")
}
