import PostContent from "../../molecules/post-content"
import { PostTitle } from "../../molecules/post-title"

export const PostEditorBasic = () => (
  <div className="px-6 py-20">
    <div className="max-w-[650px] mx-auto flex flex-col gap-4">
      <PostTitle variant="basic" />
      <PostContent />
    </div>
  </div>
)
