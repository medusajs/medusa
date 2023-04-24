import { AutoSavingIndicator } from "../../../auto-saving-indicator"
import { usePostSectionContext } from "./context/post-section-context"
import { PostSectionBackButton } from "./post-section-back-button"
import { PostSectionOptionsMenu } from "./post-section-options-menu"
import { PostSectionPublishButton } from "./post-section-publish-button"
import { PostSectionStatus } from "./post-section-status"

export const PostSectionHeader = () => {
  const { isDraft, isAutoSaving } = usePostSectionContext()

  return (
    <header className="top-0 flex flex-col grow-0 shrink-0 border-b border-b-grey-20 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-0.5 flex-grow-0">
          <PostSectionBackButton />

          {isDraft && (
            <AutoSavingIndicator
              isAutoSaving={isAutoSaving}
              showLabel={false}
            />
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-grow-0">
          <div>
            <PostSectionStatus />
          </div>
          <div>
            <PostSectionPublishButton />
          </div>
          <div>
            <PostSectionOptionsMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
