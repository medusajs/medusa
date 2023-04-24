import { FC, useEffect, useMemo, useState } from "react"
import InputHeader from "../../../../components/fundamentals/input-header"
import { NextSelect } from "../../../../components/molecules/select/next-select"
import { NestedForm } from "../../../../utils/nested-form"
import { type GeneralFormType } from "../general-form"
import api from "../../../../services/api"

export interface TaxCategory {
  id: string
  name: string
  description: string
}

export const TaxCategoriesForm: FC<{
  form: NestedForm<GeneralFormType>
}> = ({ form }) => {
  const { setValue, path, watch } = form

  const [taxCategories, setTaxCategories] = useState<TaxCategory[]>()
  const selectedTaxCategoryId = watch(path("tax_category_id"))

  const taxCategoryOptions = useMemo(() => {
    if (!taxCategories) return []
    const options = taxCategories.map((taxCategory) => ({
      label: (
        <div className="tax-category-option flex flex-col gap-2">
          <span className="text-grey-50">{taxCategory.name}</span>

          <span className="tax-category-option--description text-grey-40 text-sm">
            {taxCategory.description}
          </span>
        </div>
      ),
      value: taxCategory.id,
      description: `${taxCategory.name} ${taxCategory.description}`,
    }))

    return options
  }, [taxCategories])

  const selectedTaxCategoryOption = useMemo(
    () =>
      taxCategoryOptions.find(
        (option) => option.value === selectedTaxCategoryId
      ),
    [taxCategoryOptions, selectedTaxCategoryId]
  )

  useEffect(() => {
    api.products.listTaxCategories().then((response) => {
      setTaxCategories(response.data.product_tax_categories)
    })
  }, [])

  return (
    <>
      <InputHeader label="Tax Category" className="mb-xsmall" />

      <NextSelect
        className="tax-category-select mb-4 [&_.tax-category-option--description]:hidden"
        options={taxCategoryOptions}
        filterOption={(option, rawInput) => {
          const input = rawInput.toLowerCase()
          return option.data.description.toLowerCase().includes(input)
        }}
        value={selectedTaxCategoryOption}
        onChange={({ value }) => {
          setValue(path("tax_category_id"), value)
        }}
      />
    </>
  )
}
