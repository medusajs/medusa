import { ChangeEvent } from "react"
import { useFormContext } from "react-hook-form"
import Textarea from "../../../../components/molecules/textarea"
import { useUpdatePostDraft } from "../../helpers/use-update-post-draft"
import { usePostContext } from "../../context/post-context"

const PostExcerpt = () => {
  const { featureFlags } = usePostContext()
  const { register } = useFormContext()
  const { updatePostDraft } = useUpdatePostDraft()

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const excerpt = event.target.value
    updatePostDraft({ excerpt })
  }

  if (!featureFlags.excerpt) return null

  return (
    <Textarea
      label="Excerpt"
      rows={4}
      readOnly={featureFlags.excerpt === "readonly"}
      {...register("excerpt", { onChange: handleChange })}
    />
  )
}

export default PostExcerpt
