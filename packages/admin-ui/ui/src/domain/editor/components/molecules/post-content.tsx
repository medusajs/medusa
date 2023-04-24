import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useUpdatePostDraft } from "../../helpers/use-update-post-draft"
import { Editor } from "../../../../components/organisms/editor"
import { usePostContext } from "../../context"

const PostContent = () => {
  const [isReady, setIsReady] = useState(false)
  const { featureFlags } = usePostContext()
  const { control, setValue } = useFormContext()
  const { updatePostDraft } = useUpdatePostDraft()

  const handleChange = async (content) => {
    // Editor calls `onChange` when it first loads, so we want to avoid
    // auto-saving before the user actually makes a change.
    if (!isReady) return

    setValue("content", content, { shouldDirty: true })
    updatePostDraft({ content })
  }

  if (!featureFlags.content) return null

  return (
    <div className="prose lg:prose-xl">
      <Controller
        name="content"
        control={control}
        render={({ field: { value } }) => (
          <Editor
            value={value}
            onInitialize={() => setIsReady(true)}
            placeholder="Begin writing your post..."
            onChange={handleChange}
            readOnly={featureFlags.content === "readonly"}
          />
        )}
      />
    </div>
  )
}

export default PostContent
