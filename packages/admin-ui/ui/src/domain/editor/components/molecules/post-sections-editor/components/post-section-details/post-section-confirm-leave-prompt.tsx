import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { usePostContext } from "../../../../../context/post-context"
import { usePostSectionContext } from "./context/post-section-context"
import { UnsavedChangesPrompt } from "../../../../../../../components/organisms/unsaved-changes-prompt"
import { updateLivePreviewPostData } from "../../../../../helpers/update-live-preview-post-data"

export const PostSectionConfirmLeavePrompt: FC = () => {
  const navigate = useNavigate()
  const {
    post,
    confirmLeave,
    setConfirmLeave,
    shouldConfirmLeaveSection,
    shouldConfirmLeavePost,
    onSave: onPostSave,
  } = usePostContext()
  const { postSection, onSave: onPostSectionSave } = usePostSectionContext()

  const handleCancel = () => setConfirmLeave(null)

  const handleConfirm = () => {
    if (!confirmLeave) return

    // Reset the live preview with the previous section data.
    updateLivePreviewPostData({ post, sections: [postSection] })

    setConfirmLeave(null)
    navigate(confirmLeave?.navigateTo)
  }

  const handleSaveAndConfirm = async () => {
    if (!confirmLeave) return
    if (shouldConfirmLeaveSection) await onPostSectionSave()

    // NOTE: Only save the post if user is attempting to leave the post.
    if (confirmLeave?.from === "post" && shouldConfirmLeavePost)
      await onPostSave()

    setConfirmLeave(null)
    navigate(confirmLeave?.navigateTo)
  }

  // Only display the prompt if we are leaving the section.
  if (!confirmLeave || confirmLeave.context !== "section") return null

  return (
    <UnsavedChangesPrompt
      onConfirm={handleConfirm}
      onSaveAndConfirm={handleSaveAndConfirm}
      onCancel={handleCancel}
      handleClose={handleCancel}
    />
  )
}
