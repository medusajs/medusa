import clsx from "clsx"
import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import Button from "../../../../components/fundamentals/button"
import PostPublishMenu from "../molecules/post-publish-menu"
import PostStatus from "../molecules/post-status"
import PostBackButton from "../molecules/post-back-button"
import { usePostContext } from "../../context/post-context"
import ShowSidebarLeftIcon from "../../../../components/fundamentals/icons/show-sidebar-left"
import HideSidebarLeftIcon from "../../../../components/fundamentals/icons/hide-sidebar-left"
import { AutoSavingIndicator } from "../molecules/auto-saving-indicator"
import Tooltip from "../../../../components/atoms/tooltip"

const PostDetailsHeader = () => {
  const {
    postTypeLabel,
    isDraft,
    isPublished,
    isEditorOpen,
    toggleEditor,
    isSettingsOpen,
    toggleSettings,
    isAdvancedMode,
    previewURL,
    liveURL,
    isAutoSaving,
    featureFlags,
  } = usePostContext()

  return (
    <div className="z-30 sticky top-0 flex gap-2 justify-between border border-b-grey-20 bg-white px-4 py-4">
      <div className="flex items-center gap-2">
        <PostBackButton />

        {isAdvancedMode && (
          <Tooltip
            side="bottom"
            content={isEditorOpen ? "Hide editor" : "Show editor"}
          >
            <Button
              variant="secondary"
              size="medium"
              onClick={() => toggleEditor()}
              className={clsx("p-0 w-10 h-10")}
            >
              <span>
                {isEditorOpen ? (
                  <HideSidebarLeftIcon className="w-5 h-5" />
                ) : (
                  <ShowSidebarLeftIcon className="w-5 h-5" />
                )}
              </span>
            </Button>
          </Tooltip>
        )}

        {isDraft && <AutoSavingIndicator isAutoSaving={isAutoSaving} />}
      </div>

      <div className="flex items-center gap-2">
        <PostStatus />

        {featureFlags.view_preview && isDraft && (
          <a href={previewURL} target="_blank">
            <Button variant="secondary" size="medium">
              Preview
            </Button>
          </a>
        )}

        {featureFlags.view_live && isPublished && (
          <Button
            variant="secondary"
            size="medium"
            onClick={() => window.open(liveURL, "_blank")}
          >
            <span>View {postTypeLabel}</span>
          </Button>
        )}

        <PostPublishMenu />

        {featureFlags.settings && (
          <Button
            variant="secondary"
            size="medium"
            onClick={() => toggleSettings()}
            className={clsx("p-0 w-10 h-10", {
              "text-violet-70": isSettingsOpen,
            })}
          >
            <span>
              <Cog6ToothIcon className="w-6 h-6" />
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}

export default PostDetailsHeader
