import Tooltip from "../../../../../../../components/atoms/tooltip"
import Badge from "../../../../../../../components/fundamentals/badge"
import LibraryIcon from "../../../../../../../components/fundamentals/icons/library"
import { usePostSectionContext } from "./context/post-section-context"

export const PostSectionUsage = () => {
  const { postSection } = usePostSectionContext()

  const usageCount = postSection.usage_count || 1

  if (!postSection.is_reusable) return null

  return (
    <Tooltip
      sideOffset={4}
      className="!z-50 !max-w-[240] !p-4"
      content={
        <>
          <p>
            This is a reusable{" "}
            <strong className="font-semibold">library section</strong>. It is
            currently used in{" "}
            <strong className="font-semibold">{usageCount}</strong>
            &nbsp;location
            {usageCount > 1 ? "s" : ""}.
          </p>
          <hr className="my-4 -mx-4" />
          <p>
            <strong className="font-semibold">Note:</strong> Changes made to
            this section will be reflected in all posts that use it and in all
            locations where it appears.
          </p>
        </>
      }
    >
      <Badge
        variant="primary"
        size="medium"
        className="flex items-center justify-center p-0 w-8 h-8"
      >
        <LibraryIcon className="w-5 h-5" />
      </Badge>
    </Tooltip>
  )
}
