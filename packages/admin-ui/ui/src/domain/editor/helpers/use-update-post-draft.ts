import debounce from "lodash/debounce"
import merge from "lodash/merge"
import {
  AdminUpdatePostReq,
  useAdminUpdatePost,
} from "../../../hooks/admin/posts"
import { PostStatus } from "../../../types/shared"
import { usePostContext } from "../context"
import { updateLivePreviewPostData } from "./update-live-preview-post-data"

export const useUpdatePostDraft = () => {
  const { post, setIsAutoSaving } = usePostContext()
  const { mutateAsync: updatePost } = useAdminUpdatePost(
    post?.id || "",
    post.type
  )

  const handleRealtimeUpdate = debounce(
    async (payload) => {
      if (!post) return

      updateLivePreviewPostData({ post: merge({}, post, payload) })
    },
    250,
    { leading: false, trailing: true }
  )

  const handlePostDraftUpdate = debounce(
    async (payload, onUpdate) => {
      if (!post) return

      setIsAutoSaving(true)

      updateLivePreviewPostData({ post: merge({}, post, payload) })

      await updatePost({ ...payload, status: post.status })

      if (onUpdate) onUpdate()

      setTimeout(() => setIsAutoSaving(false), 250)
    },
    250,
    { leading: false, trailing: true }
  )

  return {
    updatePostDraft: (
      payload: Omit<AdminUpdatePostReq, "status">,
      onUpdate?: () => void
    ) => {
      if (post && post.status === PostStatus.DRAFT)
        return handlePostDraftUpdate(payload, onUpdate)

      if (post && post.status === PostStatus.PUBLISHED)
        return handleRealtimeUpdate(payload)
    },
  }
}
