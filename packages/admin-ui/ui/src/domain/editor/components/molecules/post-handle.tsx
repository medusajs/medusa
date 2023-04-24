import { useFormContext } from "react-hook-form"
import lowerCase from "lodash/lowerCase"
import Input from "../../../../components/molecules/input"
import { usePostContext } from "../../context"
import { checkHandle } from "../../helpers/check-handle"
import { useUpdatePostDraft } from "../../helpers/use-update-post-draft"

const PostHandle = () => {
  const { register, setValue, watch } = useFormContext()
  const { post, postTypeLabel, liveBaseURL, featureFlags } = usePostContext()
  const { updatePostDraft } = useUpdatePostDraft()
  const watchHandle = watch("handle")

  const handleBlur = async (event) => {
    if (featureFlags.handle !== true) return

    const value = event.target.value

    if (!value) {
      // Prevent handle from being cleared if it's already set
      if (post.handle) setValue("handle", post.handle)
      return
    }

    // Avoid updating post draft if handle value hasn't changed
    if (value === post.handle) return

    const { suggestedHandle } = await checkHandle(value, post?.id)

    setValue("handle", suggestedHandle, { shouldDirty: true })
    updatePostDraft({ handle: suggestedHandle })
  }

  if (!featureFlags.handle) return null

  return (
    <div className="mt-2 flex flex-col gap-4">
      <Input
        label={`${postTypeLabel} handle`}
        placeholder={`Enter a handle for this ${lowerCase(postTypeLabel)}`}
        readOnly={featureFlags.handle === "readonly"}
        {...register("handle", { onBlur: handleBlur })}
      />
      <p className="-mt-2 inter-small-regular text-grey-50 break-words">
        {liveBaseURL}
        {watchHandle ? `/${watchHandle}` : ""}
      </p>
    </div>
  )
}

export default PostHandle
