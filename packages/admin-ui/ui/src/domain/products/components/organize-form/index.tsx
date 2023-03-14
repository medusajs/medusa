import { Controller } from "react-hook-form"
import {
  NextCreateableSelect,
  NextSelect,
} from "../../../../components/molecules/select/next-select"
import TagInput from "../../../../components/molecules/tag-input"
import { Option } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"
import useOrganizeData from "./use-organize-data"
import NestedMultiselect from "../../../categories/components/multiselect"
import InputHeader from "../../../../components/fundamentals/input-header"
import {
  useFeatureFlag,
  FeatureFlag,
} from "../../../../providers/feature-flag-provider"

export type OrganizeFormType = {
  type: Option | null
  collection: Option | null
  tags: string[] | null
  categories: string[] | null
}

type Props = {
  form: NestedForm<OrganizeFormType>
}

const OrganizeForm = ({ form }: Props) => {
  const { control, path, setValue } = form
  const { productTypeOptions, collectionOptions, categoriesOptions } =
    useOrganizeData()

  const { isFeatureEnabled } = useFeatureFlag()

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
      <div className="mb-large gap-x-large grid grid-cols-2">
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

      {isFeatureEnabled(FeatureFlag.PRODUCT_CATEGORIES) && (
        <>
          <InputHeader label="Categories" className="mb-2" />
          <Controller
            name={path("categories")}
            control={control}
            render={({ field: { value, onChange } }) => {
              if (!categoriesOptions) {
                return null
              }

              const initiallySelected = (value || []).reduce((acc, val) => {
                acc[val] = true
                return acc
              }, {})

              return (
                <NestedMultiselect
                  onSelect={onChange}
                  options={categoriesOptions}
                  initiallySelected={initiallySelected}
                />
              )
            }}
          />
        </>
      )}

      <div className="mb-large" />

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
