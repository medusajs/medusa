import React from "react"
import { Controller } from "react-hook-form"
import {
  NextCreateableSelect,
  NextSelect,
} from "../../../../components/molecules/select/next-select"
import TagInput from "../../../../components/molecules/tag-input"
import { Option } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"
import useOrganizeData from "./use-organize-data"

export type OrganizeFormType = {
  type: Option | null
  collection: Option | null
  tags: string[] | null
}

type Props = {
  form: NestedForm<OrganizeFormType>
}

const OrganizeForm = ({ form }: Props) => {
  const { control, path, setValue } = form
  const { productTypeOptions, collectionOptions } = useOrganizeData()

  const typeOptions = productTypeOptions

  const onCreateOption = (value: string) => {
    typeOptions.push({ label: value, value })
    setValue(
      path("type"),
      { label: value, value },
      {
        shouldDirty: true,
      }
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-large mb-large">
        <Controller
          name={path("type")}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <NextCreateableSelect
                label="Type"
                onChange={onChange}
                options={productTypeOptions}
                value={value || null}
                placeholder="Choose a type"
                onCreateOption={onCreateOption}
                isClearable
              />
            )
          }}
        />
        <Controller
          name={path("collection")}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <NextSelect
                label="Collection"
                onChange={onChange}
                options={collectionOptions}
                value={value}
                placeholder="Choose a collection"
                isClearable
              />
            )
          }}
        />
      </div>
      <Controller
        control={control}
        name={path("tags")}
        render={({ field: { value, onChange } }) => {
          return <TagInput onChange={onChange} values={value || []} />
        }}
      />
    </div>
  )
}

export default OrganizeForm
