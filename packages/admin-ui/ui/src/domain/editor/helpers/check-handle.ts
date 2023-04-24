import medusaRequest from "../../../services/request"
import { formatHandle } from "../../../utils/format-handle"

// Check if there is a post that exists that already has this handle
export const checkHandle = async (handle: string, postId?: string) => {
  const path = `/admin/posts/check-handle?handle=${formatHandle(handle)}&id=${
    postId || ""
  }`

  const { data } = await medusaRequest<{
    exists: boolean
    suggestedHandle: string
  }>("GET", path)

  return data
}
