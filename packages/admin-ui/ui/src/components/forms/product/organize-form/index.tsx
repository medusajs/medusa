import { Controller } from "react-hook-form"
import NestedMultiselect from "../../../../domain/categories/components/multiselect"
import {
  FeatureFlag,
  useFeatureFlag,
} from "../../../../providers/feature-flag-provider"
import { Option } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"
import InputHeader from "../../../fundamentals/input-header"
import {
  NextCreateableSelect,
  NextSelect,
} from "../../../molecules/select/next-select"
import TagInput from "../../../molecules/tag-input"
import useOrganizeData from "./use-organize-data"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  const { control, path, setValue } = form
  const {
    productTypeOptions,
    collectionOptions,
    categoriesOptions = [],
  } = useOrganizeData()

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
                label={t("organize-form-type-label", "Type")}
                onChange={onChange}
                options={productTypeOptions}
                value={value || null}
                placeholder={t(
                  "organize-form-type-placeholder",
                  "Choose a type"
                )}
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
                label={t("organize-form-collection-label", "Collection")}
                onChange={onChange}
                options={collectionOptions}
                value={value}
                placeholder={t(
                  "organize-form-collection-placeholder",
                  "Choose a collection"
                )}
                isClearable
              />
            )
          }}
        />
      </div>

      {isFeatureEnabled(FeatureFlag.PRODUCT_CATEGORIES) ? (
        <>
          <InputHeader
            label={t("organize-form-categories-label", "Categories")}
            className="mb-2"
          />
          <Controller
            name={path("categories")}
            control={control}
            render={({ field: { value, onChange } }) => {
              const initiallySelected = (value || []).reduce((acc, val) => {
                acc[val] = true
                return acc
              }, {} as Record<string, true>)

              return (
                <NestedMultiselect
                  placeholder={
                    !!categoriesOptions?.length
                      ? t(
                          "organize-form-categories-placeholder",
                          "Choose categories"
                        )
                      : t(
                          "organize-form-categories-placeholder-no-categories",
                          "No categories available"
                        )
                  }
                  onSelect={onChange}
                  options={categoriesOptions}
                  initiallySelected={initiallySelected}
                />
              )
            }}
          />
        </>
      ) : null}

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
