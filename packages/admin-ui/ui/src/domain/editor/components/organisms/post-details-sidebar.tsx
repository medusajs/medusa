import { FC } from "react"
import clsx from "clsx"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import { usePostContext } from "../../context"
import PostFeaturedImage from "../molecules/post-featured-image"
import PostHandle from "../molecules/post-handle"
import PostDeleteButton from "../molecules/post-delete-button"
import PostExcerpt from "../molecules/post-excerpt"
import PostAuthors from "../molecules/post-authors"
import PostTags from "../molecules/post-tags"
import PostContentMode from "../molecules/post-content-mode"
import PostSetHomePageButton from "../molecules/post-set-home-page-button"

export interface PostDetailsSidebarProps {}

const PostDetailsSidebar: FC<PostDetailsSidebarProps> = () => {
  const {
    postTypeLabel,
    isHomePage,
    isBasicMode,
    isSettingsOpen,
    toggleSettings,
    featureFlags,
  } = usePostContext()

  const showContentMode = !["basic_only", "advanced_only"].includes(
    featureFlags.content_mode || ""
  )
  const showFeaturedImage = !!(featureFlags.featured_image && isBasicMode)

  return (
    <div className="h-full overflow-y-auto border-l border-grey-20 bg-white">
      <div
        className={clsx(
          "p-6 w-[375px] large:w-[400px] inter-base-regular flex flex-col gap-4",
          {
            hidden: !isSettingsOpen,
          }
        )}
      >
        <header className="flex items-start justify-between gap-4">
          <h2 className="inter-xlarge-semibold mt-0">
            {postTypeLabel} settings
          </h2>

          <button
            onClick={() => toggleSettings(false)}
            className="text-grey-50 cursor-pointer"
          >
            <CrossIcon size={20} />
          </button>
        </header>

        {!!featureFlags["handle"] && !isHomePage && <PostHandle />}

        {!!featureFlags["home_page"] && <PostSetHomePageButton />}

        {!!featureFlags["tags"] && <PostTags />}

        {!!featureFlags["excerpt"] && <PostExcerpt />}

        {!!featureFlags["authors"] && <PostAuthors />}

        {[showContentMode, showFeaturedImage].includes(true) && (
          <>
            <hr className="my-2" />

            {showContentMode && <PostContentMode />}

            {showFeaturedImage && <PostFeaturedImage />}
          </>
        )}

        {!!featureFlags["delete"] && (
          <>
            <hr className="my-2" />

            <PostDeleteButton />
          </>
        )}
      </div>
    </div>
  )
}

export default PostDetailsSidebar
