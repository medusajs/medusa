import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { usePostContext } from "../../context/post-context"
import { UnsavedChangesPrompt } from "../../../../components/organisms/unsaved-changes-prompt"

export const PostConfirmLeavePrompt: FC = () => {
  const navigate = useNavigate()
  const { post, setConfirmLeave, confirmLeave, onSave } = usePostContext()

  const handleCancel = () => setConfirmLeave(null)

  const handleConfirm = () => {
    if (!confirmLeave) return

    navigate(confirmLeave?.navigateTo)
  }

  const handleSaveAndConfirm = async () => {
    if (onSave) await onSave()

    handleConfirm()
  }

  // Only display the prompt if we are leaving the post.
  if (!confirmLeave || confirmLeave?.context !== "post") return null

  return (
    <UnsavedChangesPrompt
      heading={`Are you sure you want to leave this ${post.type}?`}
      onConfirm={handleConfirm}
      onSaveAndConfirm={handleSaveAndConfirm}
      onCancel={handleCancel}
      handleClose={handleCancel}
    />
  )
}
