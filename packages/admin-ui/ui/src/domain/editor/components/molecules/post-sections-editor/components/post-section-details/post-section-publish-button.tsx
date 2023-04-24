import { useFormContext } from "react-hook-form"
import Button from "../../../../../../../components/fundamentals/button"
import { usePostSectionContext } from "./context/post-section-context"
import { PostSectionStatus } from "../../../../../../../types/shared"

export const PostSectionPublishButton = () => {
  const { setValue } = useFormContext()
  const { onSave, isDraft, isPublished } = usePostSectionContext()

  const handleSaveClick = () => {
    if (isDraft)
      setValue("status", PostSectionStatus.PUBLISHED, {
        shouldDirty: false,
      })
    onSave()
  }

  return (
    <Button variant="secondary" size="small" onClick={handleSaveClick}>
      <span>{isPublished ? "Update" : "Publish"}</span>
    </Button>
  )
}
