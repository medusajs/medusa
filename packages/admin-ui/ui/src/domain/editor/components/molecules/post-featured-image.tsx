import { useUpdatePostDraft } from "../../helpers/use-update-post-draft"
import { FileInput } from "../../../../components/molecules/file-input"
import { usePostContext } from "../../context/post-context"

const PostFeaturedImage = () => {
  const { featureFlags } = usePostContext()
  const { updatePostDraft } = useUpdatePostDraft()

  const handleFileChosen = async (files) => {
    updatePostDraft({ featured_image: files[0]?.url || "" })
  }

  const handleFileClear = () => {
    updatePostDraft({ featured_image: null, featured_image_id: null })
  }

  if (!featureFlags.featured_image) return null

  return (
    <FileInput
      label="Featured image"
      name="featured_image"
      onFileChosen={handleFileChosen}
      onFileClear={handleFileClear}
      className="inter-small-regular"
      disabled={featureFlags.featured_image === "readonly"}
    />
  )
}

export default PostFeaturedImage
