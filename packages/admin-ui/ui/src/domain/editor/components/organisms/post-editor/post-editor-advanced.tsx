import { PostLivePreview } from "../../molecules/post-live-preview"
import { PostSectionsEditor } from "../../molecules/post-sections-editor"

export const PostEditorAdvanced = () => (
  <div className="flex h-full">
    <div className="h-full overflow-y-auto grow-0 shrink-0">
      <PostSectionsEditor />
    </div>

    <div className="h-full flex-1 min-w-0">
      <PostLivePreview />
    </div>
  </div>
)
