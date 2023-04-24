import { useFormContext } from "react-hook-form"
import Badge from "../../../../../../../components/fundamentals/badge"
import { usePostSectionContext } from "./context/post-section-context"
import { PostSectionUsage } from "./post-section-usage"

export const PostSectionStatus = () => {
  const { isDraft, isPublished } = usePostSectionContext()
  const { formState } = useFormContext()

  return (
    <div className="flex gap-2 items-center">
      {isDraft && (
        <Badge variant="default" size="medium">
          Draft
        </Badge>
      )}

      {isPublished && formState.isDirty && (
        <Badge variant="warning" size="medium">
          Unsaved
        </Badge>
      )}

      <PostSectionUsage />
    </div>
  )
}
