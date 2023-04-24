import PostDetailsMain from "../organisms/post-details-main"
import PostDetailsHeader from "../organisms/post-details-header"
import PostDetailsSidebar from "../organisms/post-details-sidebar"
import { PostConfirmLeavePrompt } from "../molecules/post-confirm-leave-prompt"
import { usePostContext } from "../../context"

export const PostDetailsTemplate = () => {
  const { featureFlags } = usePostContext()

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="grow-0 shrink-0">
          <PostDetailsHeader />
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="min-w-0 grow shrink">
            <PostDetailsMain />
          </div>

          {featureFlags.settings && (
            <div className="min-w-0 grow-0 shrink-0">
              <PostDetailsSidebar />
            </div>
          )}
        </div>
      </div>

      <PostConfirmLeavePrompt />
    </>
  )
}
