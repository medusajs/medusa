import {
  Alert,
  Checkbox,
  clx,
  Heading,
  Hint,
  InlineTip,
  Label,
  Text,
} from "@medusajs/ui"
import {
  FieldArrayWithId,
  useFieldArray,
  UseFormReturn,
  useWatch,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useEffect, useMemo, useState } from "react"

import { Form } from "../../../../../../../components/common/form"
import { SortableList } from "../../../../../../../components/common/sortable-list"
import { SwitchBox } from "../../../../../../../components/common/switch-box"
import { ChipInput } from "../../../../../../../components/inputs/chip-input"
import { Combobox } from "../../../../../../../components/inputs/combobox"
import { ProductCreateSchemaType } from "../../../../types"
import { decorateVariantsWithDefaultValues } from "../../../../utils"
import { productOptionsQueryKeys } from "../../../../../../../hooks/api"
import { useComboboxData } from "../../../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../../../lib/client"
import { AdminProductOption, HttpTypes } from "@medusajs/types"

type ProductCreateVariantsSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

type ProductOptionFormValue = {
  title: string
  values: string[]
  id?: string
  value_ids?: string[]
}

// An option being assigned during create: either an existing option (full
// detail) or a brand-new option captured as a title + value names.
type SelectedOptionInput =
  | Pick<AdminProductOption, "id" | "title" | "values">
  | { title: string; values: string[] }

const getPermutations = (
  data: { title: string; values: string[] }[]
): { [key: string]: string }[] => {
  if (data.length === 0) {
    return []
  }

  if (data.length === 1) {
    return data[0].values.map((value) => ({ [data[0].title]: value }))
  }

  const toProcess = data[0]
  const rest = data.slice(1)

  return toProcess.values.flatMap((value) => {
    return getPermutations(rest).map((permutation) => {
      return {
        [toProcess.title]: value,
        ...permutation,
      }
    })
  })
}

const getVariantName = (options: Record<string, string>) => {
  return Object.values(options).join(" / ")
}

export const ProductCreateVariantsSection = ({
  form,
}: ProductCreateVariantsSectionProps) => {
  const { t } = useTranslation()

  const variants = useFieldArray({
    control: form.control,
    name: "variants",
  })

  const watchedAreVariantsEnabled = useWatch({
    control: form.control,
    name: "enable_variants",
    defaultValue: false,
  })

  const watchedOptions = useWatch({
    control: form.control,
    name: "options",
    defaultValue: [],
  })

  const watchedVariants = useWatch({
    control: form.control,
    name: "variants",
    defaultValue: [],
  })

  const showInvalidOptionsMessage = !!form.formState.errors.options?.length
  const showInvalidVariantsMessage =
    form.formState.errors.variants?.root?.message === "invalid_length"

  const selectedExistingOptionIds = useMemo(
    () =>
      watchedOptions.map((opt) => opt.id).filter((id): id is string => !!id),
    [watchedOptions]
  )

  const productOptionsCombobox = useComboboxData({
    queryKey: productOptionsQueryKeys.list({ is_exclusive: false }),
    queryFn: (params) =>
      sdk.admin.productOption.list({
        ...params,
        is_exclusive: false,
        fields: "id,title,values.id,values.value,values.rank",
      } as HttpTypes.AdminProductOptionListParams),
    getOptions: (data) =>
      data.product_options.map((option) => ({
        label: option.title,
        value: option.id,
        option,
      })),
  })

  // Accumulate the full option details as they appear in the picker pages.
  // Accumulating (rather than reading only the current page) keeps a selected
  // option's values available even if a later search filters it out of the
  // current results.
  const [optionDetailsById, setOptionDetailsById] = useState(
    () => new Map<string, AdminProductOption>()
  )

  useEffect(() => {
    setOptionDetailsById((prev) => {
      let next: Map<string, AdminProductOption> | undefined

      for (const choice of productOptionsCombobox.options) {
        if (choice.option && prev.get(choice.value) !== choice.option) {
          next ??= new Map(prev)
          next.set(choice.value, choice.option)
        }
      }

      return next ?? prev
    })
  }, [productOptionsCombobox.options])

  const knownOptionIds = useMemo(() => {
    const ids = new Set<string>(selectedExistingOptionIds)
    productOptionsCombobox.options.forEach((option) => ids.add(option.value))
    return ids
  }, [selectedExistingOptionIds, productOptionsCombobox.options])

  const productOptionChoices = useMemo(() => {
    const merged = new Map<string, { label: string; value: string }>()
    productOptionsCombobox.options.forEach((option) =>
      merged.set(option.value, option)
    )

    // Make sure every selected option (existing or newly typed) has a label
    // entry, even when it isn't on the current page / search result — otherwise
    // its chip can't resolve. Existing options are keyed by id, new ones by
    // title.
    watchedOptions.forEach((opt) => {
      const value = opt.id || opt.title
      if (value && !merged.has(value)) {
        merged.set(value, { value, label: opt.title || value })
      }
    })

    return [...merged.values()]
  }, [productOptionsCombobox.options, watchedOptions])

  const selectedOptionValues = useMemo(() => {
    return watchedOptions.map((opt) => opt.id || opt.title)
  }, [watchedOptions])

  const handleProductOptionSelect = (optionValues: string[]) => {
    const existingOptionIds = optionValues.filter((val) =>
      knownOptionIds.has(val)
    )
    const newOptionTitles = optionValues.filter(
      (val) => !knownOptionIds.has(val)
    )

    const allSelectedOptions: SelectedOptionInput[] = []

    const watchedOptions = form.getValues("options")

    existingOptionIds.forEach((id) => {
      const details = optionDetailsById.get(id)
      if (details) {
        allSelectedOptions.push(details)
      }
    })

    watchedOptions.forEach((opt) => {
      if (!opt.id && opt.title && newOptionTitles.includes(opt.title)) {
        allSelectedOptions.push({
          title: opt.title,
          values: opt.values || [],
        })
      }
    })

    const newSelectedValues: Record<string, string[]> = {}

    allSelectedOptions.forEach((option) => {
      if ("id" in option && option.id) {
        const currentOption = watchedOptions.find((opt) => opt.id === option.id)
        if (currentOption?.value_ids) {
          newSelectedValues[option.id] = currentOption.value_ids
        } else {
          newSelectedValues[option.id] = option.values?.map((v) => v.id) || []
        }
      }
    })

    updateFormWithSelectedValues(allSelectedOptions, newSelectedValues)
  }

  const generateAndSetVariants = (options: ProductOptionFormValue[]) => {
    const permutations = getPermutations(
      options.filter(({ values }) => values && values.length > 0)
    )

    const newVariants = permutations.map((permutation, index) => ({
      title: getVariantName(permutation),
      options: permutation,
      should_create: true,
      variant_rank: index,
      inventory: [{ inventory_item_id: "", required_quantity: "" }],
    }))

    form.setValue("variants", newVariants)
  }

  const handleValueChange = (optionId: string, valueIds: string[]) => {
    if (valueIds.length === 0) {
      return
    }

    const currentOption = watchedOptions.find((opt) => opt.id === optionId)
    if (!currentOption) {
      return
    }

    const productOption = optionDetailsById.get(optionId)
    const existingValueIds = new Set(
      productOption?.values?.map((v) => v.id) || []
    )

    const validValueIds: string[] = []
    const newValueNames: string[] = []

    valueIds.forEach((id) => {
      if (existingValueIds.has(id)) {
        validValueIds.push(id)
      } else {
        newValueNames.push(id)
      }
    })

    const updatedOptions = watchedOptions.map((opt) => {
      if (opt.id === optionId) {
        const selectedExistingValues =
          productOption?.values
            ?.filter((v) => validValueIds.includes(v.id))
            .map((v) => v.value) || []

        return {
          ...opt,
          value_ids: valueIds,
          values: [...selectedExistingValues, ...newValueNames],
        }
      }
      return opt
    })

    form.setValue("options", updatedOptions)
    generateAndSetVariants(updatedOptions)
  }

  const handleNewOptionValueChange = (
    optionTitle: string,
    valueNames: string[]
  ) => {
    const updatedOptions = watchedOptions.map((opt) => {
      if (!opt.id && opt.title === optionTitle) {
        return {
          ...opt,
          values: valueNames,
        }
      }
      return opt
    })

    form.setValue("options", updatedOptions)
    generateAndSetVariants(updatedOptions)
  }

  const updateFormWithSelectedValues = (
    selectedProductOptions: SelectedOptionInput[],
    valueSelections: Record<string, string[]>
  ) => {
    const newOptions: ProductOptionFormValue[] = selectedProductOptions.map(
      (option) => {
        if ("id" in option && option.id !== undefined) {
          const existingOption = option
          const selectedValueIds = valueSelections[existingOption.id] || []
          const allValues = option.values || []

          const selectedValues = allValues
            .filter((v) => selectedValueIds.includes(v.id))
            .sort((a, b) => {
              const rankA = a.rank ?? Number.MAX_VALUE
              const rankB = b.rank ?? Number.MAX_VALUE
              return rankA - rankB
            })
            .map((v) => v.value)

          return {
            id: existingOption.id,
            title: existingOption.title,
            values: selectedValues,
            value_ids:
              selectedValueIds.length > 0 ? selectedValueIds : undefined,
          }
        } else {
          const newOption = option as { title: string; values: string[] }
          return {
            title: newOption.title,
            values: newOption.values,
          }
        }
      }
    )

    form.setValue("options", newOptions)
    generateAndSetVariants(newOptions)
  }

  const handleRankChange = (
    items: FieldArrayWithId<ProductCreateSchemaType, "variants">[]
  ) => {
    // Items in the SortableList are memorised, so we need to find the current
    // value to preserve any changes that have been made to `should_create`.
    const update = items.map((item, index) => {
      const variant = watchedVariants.find((v) => v.title === item.title)

      return {
        id: item.id,
        ...(variant || item),
        variant_rank: index,
      }
    })

    variants.replace(update)
  }

  const getCheckboxState = (variants: ProductCreateSchemaType["variants"]) => {
    if (variants.every((variant) => variant.should_create)) {
      return true
    }

    if (variants.some((variant) => variant.should_create)) {
      return "indeterminate"
    }

    return false
  }

  const onCheckboxChange = (value: boolean | "indeterminate") => {
    switch (value) {
      case true: {
        const update = watchedVariants.map((variant) => {
          return {
            ...variant,
            should_create: true,
          }
        })

        form.setValue("variants", update)
        break
      }
      case false: {
        const update = watchedVariants.map((variant) => {
          return {
            ...variant,
            should_create: false,
          }
        })

        form.setValue("variants", decorateVariantsWithDefaultValues(update))
        break
      }
      case "indeterminate":
        break
    }
  }

  const createDefaultOptionAndVariant = () => {
    form.setValue("options", [
      {
        title: "Default option",
        values: ["Default option value"],
      },
    ])
    form.setValue(
      "variants",
      decorateVariantsWithDefaultValues([
        {
          title: "Default variant",
          should_create: true,
          variant_rank: 0,
          options: {
            "Default option": "Default option value",
          },
          inventory: [{ inventory_item_id: "", required_quantity: "" }],
          is_default: true,
        },
      ])
    )
  }

  return (
    <div id="variants" className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-6">
        <Heading level="h2">{t("products.create.variants.header")}</Heading>
        <SwitchBox
          control={form.control}
          name="enable_variants"
          label={t("products.create.variants.subHeadingTitle")}
          description={t("products.create.variants.subHeadingDescription")}
          onCheckedChange={(checked) => {
            if (checked) {
              form.setValue("options", [
                {
                  title: "",
                  values: [],
                },
              ])
              form.setValue("variants", [])
            } else {
              createDefaultOptionAndVariant()
            }
          }}
        />
      </div>
      {watchedAreVariantsEnabled && (
        <>
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col">
              <Label weight="plus">
                {t("products.create.variants.productOptions.label")}
              </Label>
              <Hint>{t("products.create.variants.productOptions.hint")}</Hint>
            </div>
            {showInvalidOptionsMessage && (
              <Alert dismissible variant="error">
                {t("products.create.errors.options")}
              </Alert>
            )}
            <Combobox
              value={selectedOptionValues}
              onChange={(value) => handleProductOptionSelect(value as string[])}
              options={productOptionChoices}
              searchValue={productOptionsCombobox.searchValue}
              onSearchValueChange={productOptionsCombobox.onSearchValueChange}
              fetchNextPage={productOptionsCombobox.fetchNextPage}
              isFetchingNextPage={productOptionsCombobox.isFetchingNextPage}
              shouldAlwaysShowCreateOption
              onCreateOption={async (options) => {
                const optionTitle = options[options.length - 1]?.trim()

                if (!optionTitle) {
                  return
                }

                const allSelectedOptions: SelectedOptionInput[] = []

                const valueSelections: Record<string, string[]> = {}

                watchedOptions.forEach((opt) => {
                  if (opt.id) {
                    const productOption = optionDetailsById.get(opt.id)
                    if (productOption) {
                      allSelectedOptions.push(productOption)
                      if (opt.value_ids) {
                        valueSelections[opt.id] = opt.value_ids
                      }
                    }
                  } else {
                    allSelectedOptions.push({
                      title: opt.title,
                      values: opt.values || [],
                    })
                  }
                })

                const newOption = {
                  title: optionTitle,
                  is_exclusive: true,
                  values: [],
                }

                allSelectedOptions.push(newOption)

                updateFormWithSelectedValues(
                  allSelectedOptions,
                  valueSelections
                )
              }}
              placeholder={t("products.fields.options.optionTitlePlaceholder")}
              disabled={productOptionsCombobox.isLoading}
              displayMode="chips"
            />
          </div>
          {watchedOptions.length > 0 && (
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col">
                <Label weight="plus">{t("fields.values")}</Label>
                <Hint>{t("products.create.variants.selectValuesHint")}</Hint>
              </div>
              <div className="flex flex-col gap-y-3">
                {watchedOptions.map((opt, index) => {
                  if (opt.id) {
                    const productOption = optionDetailsById.get(opt.id)

                    const existingValues = productOption?.values || []
                    const customValueNames =
                      opt.values?.filter(
                        (v) => !existingValues.some((ev) => ev.value === v)
                      ) || []

                    const existingValueOptions = [...existingValues]
                      .sort((a, b) => {
                        const rankA = a.rank ?? Number.MAX_VALUE
                        const rankB = b.rank ?? Number.MAX_VALUE
                        return rankA - rankB
                      })
                      .map((v) => ({
                        value: v.id,
                        label: v.value,
                      }))

                    const customValueOptions = customValueNames.map((v) => ({
                      value: v,
                      label: v,
                    }))

                    const valueOptions = [
                      ...existingValueOptions,
                      ...customValueOptions,
                    ]

                    return (
                      <div key={opt.id} className="flex flex-col gap-y-2">
                        <Label size="small" weight="plus">
                          {opt.title}
                        </Label>
                        <Combobox
                          value={opt.value_ids ?? []}
                          onChange={(value) =>
                            handleValueChange(opt.id!, value as string[])
                          }
                          // onCreateOption={async (values) => {
                          //   const newValueName =
                          //     values[values.length - 1]?.trim()
                          //   if (newValueName && opt.id) {
                          //     const currentValueIds = opt.value_ids || []
                          //     handleValueChange(opt.id, [
                          //       ...currentValueIds,
                          //       newValueName,
                          //     ])
                          //   }
                          // }}
                          options={valueOptions}
                          placeholder={t(
                            "products.fields.options.variantionsPlaceholder"
                          )}
                          displayMode="chips"
                        />
                      </div>
                    )
                  } else {
                    return (
                      <div key={index} className="flex flex-col gap-y-2">
                        <Label size="small" weight="plus">
                          {opt.title}
                        </Label>
                        <ChipInput
                          value={opt.values ?? []}
                          onChange={(value) =>
                            handleNewOptionValueChange(opt.title, value)
                          }
                          placeholder={t(
                            "products.fields.options.variantionsPlaceholder"
                          )}
                        />
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-x-4 gap-y-8">
            <div className="flex flex-col gap-y-6">
              <div className="flex flex-col">
                <Label weight="plus">
                  {t("products.create.variants.productVariants.label")}
                </Label>
                <Hint>
                  {t("products.create.variants.productVariants.hint")}
                </Hint>
              </div>
              {!showInvalidOptionsMessage && showInvalidVariantsMessage && (
                <Alert dismissible variant="error">
                  {t("products.create.errors.variants")}
                </Alert>
              )}
              {variants.fields.length > 0 ? (
                <div className="overflow-hidden rounded-xl border">
                  <div
                    className="bg-ui-bg-component text-ui-fg-subtle grid items-center gap-3 border-b px-6 py-2.5"
                    style={{
                      gridTemplateColumns: `20px 28px repeat(${watchedOptions.length}, 1fr)`,
                    }}
                  >
                    <div>
                      <Checkbox
                        className="relative"
                        checked={getCheckboxState(watchedVariants)}
                        onCheckedChange={onCheckboxChange}
                      />
                    </div>
                    <div />
                    {watchedOptions.map((option, index) => (
                      <div key={index}>
                        <Text size="small" leading="compact" weight="plus">
                          {option.title}
                        </Text>
                      </div>
                    ))}
                  </div>
                  <SortableList
                    items={variants.fields}
                    onChange={handleRankChange}
                    renderItem={(item, index) => {
                      return (
                        <SortableList.Item
                          id={item.id}
                          className={clx("bg-ui-bg-base border-b", {
                            "border-b-0": index === variants.fields.length - 1,
                          })}
                        >
                          <div
                            className="text-ui-fg-subtle grid w-full items-center gap-3 px-6 py-2.5"
                            style={{
                              gridTemplateColumns: `20px 28px repeat(${watchedOptions.length}, 1fr)`,
                            }}
                          >
                            <Form.Field
                              control={form.control}
                              name={`variants.${index}.should_create` as const}
                              render={({
                                field: { value, onChange, ...field },
                              }) => {
                                return (
                                  <Form.Item>
                                    <Form.Control>
                                      <Checkbox
                                        className="relative"
                                        {...field}
                                        checked={value}
                                        onCheckedChange={onChange}
                                      />
                                    </Form.Control>
                                  </Form.Item>
                                )
                              }}
                            />
                            <SortableList.DragHandle />
                            {Object.values(item.options).map((value, index) => (
                              <Text key={index} size="small" leading="compact">
                                {value}
                              </Text>
                            ))}
                          </div>
                        </SortableList.Item>
                      )
                    }}
                  />
                </div>
              ) : (
                <Alert>
                  {t("products.create.variants.productVariants.alert")}
                </Alert>
              )}
              {variants.fields.length > 0 && (
                <InlineTip label={t("general.tip")}>
                  {t("products.create.variants.productVariants.tip")}
                </InlineTip>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
