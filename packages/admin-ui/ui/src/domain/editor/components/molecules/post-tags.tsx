import React from "react"
import { Controller, useFormContext } from "react-hook-form"
import Spinner from "../../../../components/atoms/spinner"
import { NextCreateableSelect as Select } from "../../../../components/molecules/select/next-select"
import {
  useAdminCreatePostTag,
  useGetPostTags,
} from "../../../../hooks/admin/posts"
import { formatHandle } from "../../../../utils/format-handle"
import { useUpdatePostDraft } from "../../helpers/use-update-post-draft"
import { usePostContext } from "../../context/post-context"

const PostTags = () => {
  const { featureFlags } = usePostContext()
  const { control, setValue, getValues } = useFormContext()
  const { post_tags: tags, isLoading } = useGetPostTags({ limit: "999999" })
  const createPostTag = useAdminCreatePostTag()
  const { updatePostDraft } = useUpdatePostDraft()

  if (!tags && isLoading) {
    return <Spinner size="large" variant="primary" />
  }

  const options =
    tags?.map((tag) => ({ label: tag.label, value: tag.id })) || []

  const handleChange = (value) => {
    const tag_ids = value.map((v) => v.value)

    setValue("tag_ids", tag_ids, { shouldDirty: true })
    updatePostDraft({ tag_ids })
  }

  const handleCreate = async (value) => {
    const { data } = await createPostTag.mutateAsync({
      label: value,
      handle: formatHandle(value),
    })

    const updatedTagIds = [...(getValues("tag_ids") || []), data.post_tag.id]
    setValue("tag_ids", updatedTagIds, { shouldDirty: true })
    updatePostDraft({ tag_ids: updatedTagIds })
  }

  if (!featureFlags.tags) return null

  return (
    <Controller
      name="tag_ids"
      control={control}
      render={({ field }) => {
        const value = field.value
          ?.map((v) => options.find((o) => o.value === v))
          .filter((v) => v)

        return (
          <Select
            label="Tags"
            value={value}
            options={options}
            onChange={handleChange}
            onCreateOption={handleCreate}
            isMulti={true}
            isDisabled={featureFlags.tags === "readonly"}
          />
        )
      }}
    />
  )
}

export default PostTags
