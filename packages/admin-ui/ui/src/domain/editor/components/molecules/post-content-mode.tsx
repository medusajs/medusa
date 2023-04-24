import { Controller, useFormContext } from "react-hook-form"
import { useUpdatePostDraft } from "../../helpers/use-update-post-draft"
import {
  ButtonGroup,
  ButtonGroupItem,
} from "../../../../components/molecules/button-group"
import { usePostContext } from "../../context/post-context"

const PostContentMode = () => {
  const { featureFlags } = usePostContext()
  const { control, setValue } = useFormContext()
  const { updatePostDraft } = useUpdatePostDraft()

  const handleChange = async (content_mode) => {
    if (!content_mode) return

    setValue("content_mode", content_mode, { shouldDirty: true })
    updatePostDraft({ content_mode })
  }

  if (
    ["advanced_only", "basic_only"].includes(featureFlags?.content_mode || "")
  )
    return null

  return (
    <div className="mb-2">
      <h3 className="inter-base-semibold text-grey-90 mt-0 mb-2">Mode</h3>

      <Controller
        name="content_mode"
        control={control}
        render={({ field: { value } }) => (
          <ButtonGroup type="single" value={value} onValueChange={handleChange}>
            <ButtonGroupItem value="basic">Basic</ButtonGroupItem>
            <ButtonGroupItem value="advanced">Advanced</ButtonGroupItem>
          </ButtonGroup>
        )}
      />
    </div>
  )
}

export default PostContentMode
