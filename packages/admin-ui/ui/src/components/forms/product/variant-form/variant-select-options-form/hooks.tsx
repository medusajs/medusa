import { isEqual } from "lodash"
import { useMemo } from "react"
import { useWatch } from "react-hook-form"
import { VariantOptionValueType } from "."
import { AddVariantsFormType } from "../../../../../domain/products/new/add-variants"
import { NestedForm } from "../../../../../utils/nested-form"

const useCheckOptions = (variantForm: NestedForm<AddVariantsFormType>) => {
  const { control: variantControl, path: variantPath } = variantForm

  const watchedEntries = useWatch({
    control: variantControl,
    name: variantPath("entries"),
  })

  const watchedOptions = useWatch({
    control: variantControl,
    name: variantPath("options"),
  })

  const existingCombinations = useMemo(() => {
    const completedVariants = watchedEntries?.filter((entry) =>
      entry.options.every((vo) => vo.option !== null)
    )

    const existingVariants = completedVariants?.map((we) => ({
      id: we._internal_id,
      value_combo: we.options.map((vo) => vo.option),
    }))

    return existingVariants
  }, [watchedEntries])

  const checkForDuplicate = ({
    id,
    options,
  }: {
    id: string
    options: (VariantOptionValueType | null)[]
  }) => {
    if (!existingCombinations?.length) {
      return false
    }

    const existingCombinationsToCheck = existingCombinations.filter(
      (ec) => ec.id !== id
    )

    return existingCombinationsToCheck.some((existingCombination) => {
      return isEqual(
        existingCombination.value_combo.map((o) => o?.value),
        options.map((o) => o?.value)
      )
    })
  }

  const getOptions = () => {
    const options: VariantOptionValueType[] = watchedOptions
      ?.map((o) => {
        return o.values.map((v) => ({
          option_id: o.id,
          value: v,
          label: v,
        }))
      })
      .flat()

    return options
  }

  return { checkForDuplicate, getOptions }
}

export default useCheckOptions
