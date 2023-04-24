import { useFormContext } from "react-hook-form"
import { HomeIcon } from "@heroicons/react/20/solid"
import Badge from "../../../../components/fundamentals/badge"
import { usePostContext } from "../../context"

const PostStatus = () => {
  const { formState } = useFormContext()
  const { isDraft, isPublished, isHomePage, featureFlags } = usePostContext()

  return (
    <div className="flex gap-2 items-center">
      <>
        {isHomePage && (
          <Badge
            variant="primary"
            size="large"
            className="inline-flex gap-2 items-center"
          >
            <HomeIcon className="flex-0 w-4 h-4" />
            Home page
          </Badge>
        )}

        {featureFlags.status && isDraft && (
          <Badge variant="default" size="large">
            Draft
          </Badge>
        )}

        {featureFlags.status && isPublished && (
          <Badge variant="success" size="large">
            Published
          </Badge>
        )}

        {isPublished && formState.isDirty && (
          <Badge variant="warning" size="large">
            Unsaved
          </Badge>
        )}
      </>
    </div>
  )
}

export default PostStatus
