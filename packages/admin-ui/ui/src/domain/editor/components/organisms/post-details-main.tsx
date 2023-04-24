import { usePostContext } from "../../context"
import { PostEditorAdvanced } from "./post-editor/post-editor-advanced"
import { PostEditorBasic } from "./post-editor/post-editor-basic"

const PostDetailsMain = () => {
  const { isBasicMode, isAdvancedMode } = usePostContext()

  return (
    <>
      {isBasicMode && <PostEditorBasic />}
      {isAdvancedMode && <PostEditorAdvanced />}
    </>
  )
}

export default PostDetailsMain
