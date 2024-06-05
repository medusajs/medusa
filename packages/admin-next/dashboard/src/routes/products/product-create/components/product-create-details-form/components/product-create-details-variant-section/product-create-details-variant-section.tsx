import { XMarkMini } from "@medusajs/icons"
import {
  Alert,
  Button,
  Checkbox,
  Heading,
  Hint,
  IconButton,
  Input,
  Label,
  Switch,
  Text,
  clx,
} from "@medusajs/ui"
import {
  Controller,
  FieldArrayWithId,
  UseFormReturn,
  useFieldArray,
  useWatch,
} from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Form } from "../../../../../../../components/common/form"
import { SortableList } from "../../../../../../../components/common/sortable-list"
import { ChipInput } from "../../../../../../../components/inputs/chip-input"
import { ProductCreateSchemaType } from "../../../../types"
import { decorateVariantsWithDefaultValues } from "../../../../utils"

type ProductCreateVariantsSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

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

  const options = useFieldArray({
    control: form.control,
    name: "options",
  })

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

  const handleOptionValueUpdate = (index: number, value: string[]) => {
    const { isTouched: hasUserSelectedVariants } =
      form.getFieldState("variants")

    const newOptions = [...watchedOptions]
    newOptions[index].values = value

    const permutations = getPermutations(newOptions)
    const oldVariants = [...watchedVariants]

    const findMatchingPermutation = (options: Record<string, string>) => {
      return permutations.find((permutation) =>
        Object.keys(options).every((key) => options[key] === permutation[key])
      )
    }

    const newVariants = oldVariants.reduce((variants, variant) => {
      const match = findMatchingPermutation(variant.options)

      if (match) {
        variants.push({
          ...variant,
          title: getVariantName(match),
          options: match,
        })
      }

      return variants
    }, [] as typeof oldVariants)

    const usedPermutations = new Set(
      newVariants.map((variant) => variant.options)
    )
    const unusedPermutations = permutations.filter(
      (permutation) => !usedPermutations.has(permutation)
    )

    unusedPermutations.forEach((permutation) => {
      newVariants.push({
        title: getVariantName(permutation),
        options: permutation,
        should_create: hasUserSelectedVariants ? false : true,
        variant_rank: newVariants.length,
        // NOTE - prepare inventory array here for now so we prevent rendering issue if we append the items later
        inventory: [{ title: "", quantity: 0 }],
      })
    })

    form.setValue("variants", newVariants)
  }

  const handleRemoveOption = (index: number) => {
    if (index === 0) {
      return
    }

    options.remove(index)

    const newOptions = [...watchedOptions]
    newOptions.splice(index, 1)

    const permutations = getPermutations(newOptions)
    const oldVariants = [...watchedVariants]

    const findMatchingPermutation = (options: Record<string, string>) => {
      return permutations.find((permutation) =>
        Object.keys(options).every((key) => options[key] === permutation[key])
      )
    }

    const newVariants = oldVariants.reduce((variants, variant) => {
      const match = findMatchingPermutation(variant.options)

      if (match) {
        variants.push({
          ...variant,
          title: getVariantName(match),
          options: match,
        })
      }

      return variants
    }, [] as typeof oldVariants)

    const usedPermutations = new Set(
      newVariants.map((variant) => variant.options)
    )
    const unusedPermutations = permutations.filter(
      (permutation) => !usedPermutations.has(permutation)
    )

    unusedPermutations.forEach((permutation) => {
      newVariants.push({
        title: getVariantName(permutation),
        options: permutation,
        should_create: false,
        variant_rank: newVariants.length,
      })
    })

    form.setValue("variants", newVariants)
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
          inventory: [{ title: "", quantity: 0 }],
          is_default: true,
        },
      ])
    )
  }

  return (
    <div id="variants" className="flex flex-col gap-y-8">
      <Heading level="h2">{t("products.create.variants.header")}</Heading>
      <Form.Field
        control={form.control}
        name="enable_variants"
        render={({ field: { value, onChange, ...field } }) => {
          return (
            <Form.Item>
              <div className="shadow-elevation-card-rest bg-ui-bg-field flex flex-row gap-x-4 rounded-xl p-2">
                <Form.Control>
                  <Switch
                    checked={value}
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

                      onChange(!!checked)
                    }}
                    {...field}
                    className="mt-1"
                  />
                </Form.Control>
                <div className="flex flex-col">
                  <Form.Label>
                    {t("products.create.variants.subHeadingTitle")}
                  </Form.Label>
                  <Form.Hint>
                    {t("products.create.variants.subHeadingDescription")}
                  </Form.Hint>
                </div>
              </div>
            </Form.Item>
          )
        }}
      />
      {watchedAreVariantsEnabled && (
        <>
          <div className="flex flex-col gap-y-6">
            <Form.Field
              control={form.control}
              name="options"
              render={() => {
                return (
                  <Form.Item>
                    <div className="flex flex-col gap-y-4">
                      <div className="flex items-start justify-between gap-x-4">
                        <div className="flex flex-col">
                          <Form.Label>
                            {t("products.create.variants.productOptions.label")}
                          </Form.Label>
                          <Form.Hint>
                            {t("products.create.variants.productOptions.hint")}
                          </Form.Hint>
                        </div>
                        <Button
                          size="small"
                          variant="secondary"
                          type="button"
                          onClick={() => {
                            options.append({
                              title: "",
                              values: [],
                            })
                          }}
                        >
                          {t("actions.add")}
                        </Button>
                      </div>
                      {showInvalidOptionsMessage && (
                        <Alert dismissible variant="error">
                          {t("products.create.errors.options")}
                        </Alert>
                      )}
                      <ul className="flex flex-col gap-y-4">
                        {options.fields.map((option, index) => {
                          return (
                            <li
                              key={option.id}
                              className="bg-ui-bg-component shadow-elevation-card-rest grid grid-cols-[1fr_28px] items-center gap-1.5 rounded-xl p-1.5"
                            >
                              <div className="grid grid-cols-[min-content,1fr] items-center gap-1.5">
                                <div className="flex items-center px-2 py-1.5">
                                  <Label
                                    size="xsmall"
                                    weight="plus"
                                    className="text-ui-fg-subtle"
                                    htmlFor={`options.${index}.title`}
                                  >
                                    {t("fields.title")}
                                  </Label>
                                </div>
                                <Input
                                  className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover"
                                  {...form.register(
                                    `options.${index}.title` as const
                                  )}
                                  placeholder={t(
                                    "products.fields.options.optionTitlePlaceholder"
                                  )}
                                />
                                <div className="flex items-center px-2 py-1.5">
                                  <Label
                                    size="xsmall"
                                    weight="plus"
                                    className="text-ui-fg-subtle"
                                    htmlFor={`options.${index}.values`}
                                  >
                                    {t("fields.values")}
                                  </Label>
                                </div>
                                <Controller
                                  control={form.control}
                                  name={`options.${index}.values` as const}
                                  render={({
                                    field: { onChange, ...field },
                                  }) => {
                                    const handleValueChange = (
                                      value: string[]
                                    ) => {
                                      handleOptionValueUpdate(index, value)
                                      onChange(value)
                                    }

                                    return (
                                      <ChipInput
                                        {...field}
                                        variant="contrast"
                                        onChange={handleValueChange}
                                        placeholder={t(
                                          "products.fields.options.variantionsPlaceholder"
                                        )}
                                      />
                                    )
                                  }}
                                />
                              </div>
                              <IconButton
                                type="button"
                                size="small"
                                variant="transparent"
                                className="text-ui-fg-muted"
                                disabled={index === 0}
                                onClick={() => handleRemoveOption(index)}
                              >
                                <XMarkMini />
                              </IconButton>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </Form.Item>
                )
              }}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4">
            <div className="flex flex-col gap-y-1">
              <Label weight="plus">
                {t("products.create.variants.productVariants.label")}
              </Label>
              <Hint>{t("products.create.variants.productVariants.hint")}</Hint>
            </div>
            {!showInvalidOptionsMessage && showInvalidVariantsMessage && (
              <Alert dismissible variant="error">
                {t("products.create.errors.variants")}
              </Alert>
            )}
            {variants.fields.length > 0 ? (
              <div className="overflow-hidden rounded-xl border">
                <div
                  className="bg-ui-bg-component text-ui-fg-subtle grid items-center gap-3 border-b px-6 py-3.5"
                  style={{
                    gridTemplateColumns: `20px 28px repeat(${watchedOptions.length}, 1fr)`,
                  }}
                >
                  <div>
                    <Checkbox
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
                          className="text-ui-fg-subtle grid w-full items-center gap-3 px-6 py-3.5"
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
          </div>
        </>
      )}
    </div>
  )
}
