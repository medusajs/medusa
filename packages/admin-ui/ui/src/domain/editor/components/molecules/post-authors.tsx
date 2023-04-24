import { Controller, useFormContext } from "react-hook-form"
import { useAdminUsers } from "medusa-react"
import Spinner from "../../../../components/atoms/spinner"
import { useUpdatePostDraft } from "../../helpers/use-update-post-draft"
import { NextSelect as Select } from "../../../../components/molecules/select/next-select"
import { usePostContext } from "../../context/post-context"

const PostAuthors = () => {
  const { featureFlags } = usePostContext()
  const { control, setValue } = useFormContext()
  const { users } = useAdminUsers()
  const { updatePostDraft } = useUpdatePostDraft()

  if (!users) {
    return <Spinner size="large" variant="primary" />
  }

  const options = users?.map((user) => {
    const label = user.first_name
      ? `${user.first_name} ${user.last_name}`
      : user.email

    return { label, value: user.id }
  })

  const handleChange = (value) => {
    const author_ids = value.map((v) => v.value)

    setValue("author_ids", author_ids, { shouldDirty: true })
    updatePostDraft({ author_ids })
  }

  if (!featureFlags.authors) return null

  return (
    <div>
      <Controller
        name="author_ids"
        control={control}
        render={({ field }) => {
          const value = field.value?.map((v) =>
            options.find((o) => o.value === v)
          )

          return (
            <Select
              label="Authors"
              value={value}
              options={options}
              onChange={handleChange}
              isMulti={true}
              isDisabled={featureFlags.authors === "readonly"}
            />
          )
        }}
      />
    </div>
  )
}

export default PostAuthors
