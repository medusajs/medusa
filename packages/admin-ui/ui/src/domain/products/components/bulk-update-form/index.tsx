import { useAdminProductTags } from "medusa-react"
import React, { FC, useEffect } from "react"
import {
  Controller,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form"
import {
  NextCreateableSelect,
  NextSelect,
} from "../../../../components/molecules/select/next-select"
import { Option, ProductStatus } from "../../../../types/shared"
import useOrganizeData from "../organize-form/use-organize-data"

export interface BulkUpdateFormProps {
  form: UseFormReturn<BulkUpdateFormData, any>
}

export interface BulkUpdateFormData {
  add_tags?: Option[]
  remove_tags?: Option[]
  collection?: Option
  type?: Option
  status?: Option
}

export const BulkUpdateForm: FC<BulkUpdateFormProps> = ({ form }) => {
  const statusOptions = [
    { label: "Published", value: ProductStatus.PUBLISHED },
    { label: "Draft", value: ProductStatus.DRAFT },
  ]
  const { productTypeOptions, collectionOptions } = useOrganizeData()
  const { product_tags } = useAdminProductTags({ limit: 1000, offset: 0 })
  const productTagOptions =
    product_tags?.map((tag) => ({
      label: tag.value,
      value: tag.id,
    })) ?? []
  const { control } = form

  return (
    <FormProvider {...form}>
      <form>
        <Controller
          name={"status"}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <NextSelect
                className="mb-4"
                label="Status"
                onChange={onChange}
                options={statusOptions}
                value={value || null}
                placeholder="Choose a status"
                isClearable
              />
            )
          }}
        />

        <Controller
          name={"type"}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <NextCreateableSelect
                label="Type"
                className="mb-4"
                onChange={onChange}
                options={productTypeOptions}
                value={value || null}
                placeholder="Choose a type"
                isClearable
              />
            )
          }}
        />

        <Controller
          name={"collection"}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <NextSelect
                label="Collection"
                className="mb-4"
                onChange={onChange}
                options={collectionOptions}
                value={value}
                placeholder="Choose a collection"
                isClearable
              />
            )
          }}
        />

        <Controller
          name={"add_tags"}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <NextCreateableSelect
                label="Add Tags"
                className="mb-4"
                onChange={onChange}
                options={productTagOptions}
                value={value || null}
                placeholder="Choose tags to add"
                isClearable
                isMulti={true}
              />
            )
          }}
        />

        <Controller
          control={control}
          name="remove_tags"
          render={({ field: { value, onChange } }) => {
            return (
              <NextSelect
                label="Remove Tags"
                className="mb-4"
                onChange={onChange}
                options={productTagOptions}
                value={value || null}
                placeholder="Choose Tags to remove"
                isClearable
                isMulti={true}
              />
            )
          }}
        />
      </form>
    </FormProvider>
  )
}
