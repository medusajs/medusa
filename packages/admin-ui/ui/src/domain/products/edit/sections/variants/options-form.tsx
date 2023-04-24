import { Product, ProductOption, Price } from "@medusajs/medusa"
import {
  useAdminCreateProductOption,
  useAdminCreateVariant,
  useAdminDeleteProductOption,
  useAdminDeleteVariant,
  useAdminUpdateProductOption,
} from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import PlusIcon from "../../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import IconTooltip from "../../../../../components/molecules/icon-tooltip"
import InputField from "../../../../../components/molecules/input"
import TagInput from "../../../../../components/molecules/tag-input"
import useNotification from "../../../../../hooks/use-notification"
import FormValidator from "../../../../../utils/form-validator"
import { VariantOptionType } from "../../../components/variant-form/variant-select-options-form"
import { useOptionsContext } from "./options-provider"
import uniq from "lodash/uniq"
import { ProductVariantPricesCreateReq } from "@medusajs/medusa/dist/types/product-variant"
import AddOptionModal from "./add-option-modal"
import InfoIcon from "../../../../../components/fundamentals/icons/info-icon"

type Props = {
  product: Product
}

type Option = {
  id: string | null
  title: string
  values: string[]
}

type OptionsFormValues = {
  options: Option[]
}

const OptionsForm = ({ product }: Props) => {
  const {
    mutate: update,
    //  isLoading: updating
  } = useAdminUpdateProductOption(product.id)
  const {
    mutateAsync: create,
    // isLoading: creating
  } = useAdminCreateProductOption(product.id)
  const {
    mutate: del,
    //  isLoading: deleting
  } = useAdminDeleteProductOption(product.id)

  const {
    mutate: createVariant,
    // isLoading: creatingVariant
  } = useAdminCreateVariant(product.id)

  const {
    mutate: deleteVariant,
    // isLoading: deletingVariant
  } = useAdminDeleteVariant(product.id)

  const { refetch, options } = useOptionsContext()
  const [addOptionModalOpen, setAddOptionModalOpen] = useState(false)

  const {
    control,
    register,
    reset,
    // handleSubmit,
    // formState: { isDirty, errors },
  } = useForm<OptionsFormValues>({
    defaultValues: getDefaultValues(options),
  })

  const { fields, remove, append } = useFieldArray({
    name: "options",
    control,
    shouldUnregister: true,
  })

  const watchedOptions = useWatch({
    control,
    name: "options",
  })

  const variantOptionsList = useMemo(
    () =>
      watchedOptions.reduce(
        (acc, option) => {
          const newAcc: VariantOptionType[][] = []
          option.values.forEach((value) => {
            acc.forEach((a: VariantOptionType[]) => {
              newAcc.push([
                ...a.map((item) => ({
                  title: item.title,
                  option_id: item.option_id,
                  option: item.option,
                })),
                {
                  title: option.title,
                  option_id: option.id,
                  option: { value, option_id: option.id, label: value },
                },
              ] as VariantOptionType[])
            })
          })
          return newAcc
        },
        [[]] as VariantOptionType[][]
      ),
    [watchedOptions]
  )

  const notification = useNotification()

  // Note: this use effect is helpful when the options are changed from the context
  useEffect(() => {
    reset(getDefaultValues(options))
  }, [options])

  const variantExists = (variantOptions: VariantOptionType[]) =>
    product.variants.find((variant) =>
      variantOptions.every((option) =>
        variant.options.some(
          (variantOption) =>
            variantOption.option_id === option.option_id &&
            variantOption.value === option.option?.value
        )
      )
    )

  const formatPriceAsProductVariantPriceCreateReq = (
    price: Price
  ): ProductVariantPricesCreateReq => {
    return {
      currency_code: price.region_id ? undefined : price.currency_code,
      region_id: price.region_id ?? undefined,
      amount: price.amount!,
    }
  }

  const generateVariants = async () => {
    variantOptionsList.forEach(
      (variantOptions) => {
        if (variantExists(variantOptions)) return

        createVariant({
          title: `${variantOptions.reduce(
            (acc, curr) => acc + ` ${curr.option?.label || ""}`,
            ""
          )} ${product.title}`.trim(),
          allow_backorder: true,
          manage_inventory: false,
          weight: product.weight || undefined,
          length: product.length || undefined,
          height: product.height || undefined,
          width: product.width || undefined,
          origin_country: product.origin_country || undefined,
          mid_code: product.mid_code || undefined,
          material: product.material || undefined,
          prices: (product.default_price || [])
            .filter((p) => p.amount != null)
            .map(formatPriceAsProductVariantPriceCreateReq),
          options: variantOptions.map((vo) => ({
            value: vo.option?.value as string,
            option_id: vo.option?.option_id || "",
          })),
        })
      },
      {
        onError: (error) => {
          notification("Error creating variant", error.message, "error")
        },
      }
    )
  }

  const updateOptionTitle = (index: number, value: string) => {
    if (!options) return
    const option = options[index]
    if (!option) return

    update({
      option_id: option.id,
      title: value,
    })
  }

  const handleOptionDelete = (index: number) => {
    if (!options) return
    const option = options[index]
    if (!option) return remove(index)
    del(option.id, {
      onSuccess: refetch,
      onError: () => {
        notification(
          "Delete variants first",
          "To delete an options, all variants that use that option must be deleted first.",
          "info"
        )
      },
    })
  }

  const deleteVariantsWithRemovedOptions = () => {
    product.variants.forEach((variant) => {
      if (
        variant.options.some(
          (option) =>
            !watchedOptions
              .find((o) => o.id === option.option_id)
              ?.values.includes(option.value)
        )
      )
        deleteVariant(variant.id)
    })
  }

  // Compare watchedOptions with the variantOptionList and product.variants to see if there are any options that are not in product.variants and need to be created
  const optionsToCreate = useMemo(() => {
    return variantOptionsList
      .filter((variantOptions) => {
        return !product.variants.some((variant) => {
          return variantOptions.every((variantOption) => {
            return variant.options.some(
              (option) =>
                option.option_id === variantOption.option?.option_id &&
                option.value === variantOption.option?.value
            )
          })
        })
      })
      .filter(
        // filter out any options that have values with empty strings
        (variantOptions) => {
          return variantOptions.every((variantOption) => {
            return variantOption.option?.value !== ""
          })
        }
      )
  }, [variantOptionsList, product.variants])

  // Compare watchedOptions with the variantOptionsList and product.variants to see if there are any product.variants that that have options that are not in watchedOptions and need to be deleted
  const variantsToDelete = useMemo(() => {
    const filteredVariants = product.variants.filter((variant) => {
      if (variantOptionsList.length === 0) return false
      return !variantOptionsList.some((variantOptions) => {
        return variantOptions.every((variantOption) => {
          return variant.options.some(
            (option) =>
              option.option_id === variantOption.option?.option_id &&
              option.value === variantOption.option?.value
          )
        })
      })
    })

    return filteredVariants
  }, [variantOptionsList, product.variants])

  return (
    <form>
      {/* Info callout section explaining how to use options to create variants */}
      {product.variants.length === 0 && (
        <div className="my-4 p-6 pl-4 pb-4 bg-grey-10 rounded text-grey-60 inter-small leading-5">
          <div className="flex gap-2">
            <div className="pt-0.5">
              <InfoIcon className="text-red-600" width={24} />
            </div>
            <span>
              <p className="text-red-600 font-bold mb-1">
                Please add at least one variant
              </p>
              <p>
                Variants allow you to manage inventory and prices for different
                variations of your product. Add options to generate variants or
                add a default variant.
              </p>
            </span>
          </div>
          <div className="flex justify-end">
            {product.variants.length === 0 &&
              watchedOptions.length === 0 &&
              optionsToCreate.length > 0 &&
              variantsToDelete.length === 0 && (
                <Button
                  variant="primary"
                  size="small"
                  className="h-10 mt-base"
                  type="button"
                  onClick={generateVariants}
                >
                  Add a default variant
                </Button>
              )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-x-2xsmall">
        <h2 className="inter-large-semibold mb-0 flex items-center gap-1 mt-2">
          Product Options
          <IconTooltip
            type="info"
            content="Options are used to define the color, size, etc. of the product."
          />
        </h2>
      </div>

      {fields.length > 0 && (
        <div className="mt-small">
          <div className="grid grid-cols-[140px_1fr_40px] gap-x-xsmall inter-small-semibold text-grey-50 mb-small">
            <span>Option name</span>
            <span>Variations</span>
          </div>
          <div className="grid grid-cols-1 gap-y-xsmall">
            {fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="grid grid-cols-[140px_1fr_40px] gap-x-xsmall"
                >
                  <InputField
                    placeholder="Color..."
                    {...register(`options.${index}.title`, {
                      minLength: FormValidator.minOneCharRule("Option title"),
                      pattern: FormValidator.whiteSpaceRule("Option title"),
                      onChange: (e) => updateOptionTitle(index, e.target.value),
                      onBlur: (e) => updateOptionTitle(index, e.target.value),
                    })}
                  />
                  <Controller
                    control={control}
                    name={`options.${index}.values`}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <TagInput
                          onValidate={(newVal) => {
                            if (value.includes(newVal)) {
                              return null
                            }

                            return newVal
                          }}
                          invalidMessage="already exists"
                          showLabel={false}
                          values={value}
                          onChange={onChange}
                          placeholder="Blue, Red, Black..."
                        />
                      )
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="small"
                    type="button"
                    className="h-10"
                    onClick={() => handleOptionDelete(index)}
                  >
                    <TrashIcon size={20} className="text-grey-40" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between flex-wrap">
        <Button
          variant="secondary"
          size="small"
          className="h-9 mt-base w-[140px]"
          type="button"
          onClick={() => setAddOptionModalOpen(true)}
        >
          <PlusIcon size={20} className="-ml-2" />
          <span>Add option</span>
        </Button>

        {(product.variants.length > 0 ||
          (product.variants.length === 0 && optionsToCreate.length > 0)) &&
          optionsToCreate.length > 0 &&
          optionsToCreate[0].length > 0 &&
          (variantsToDelete.length === 0 || product.variants.length === 1) && (
            <Button
              variant="secondary"
              size="small"
              className="h-10 mt-base"
              type="button"
              onClick={generateVariants}
            >
              {product.variants?.length > 0
                ? `Generate variants from unused options`
                : `Generate variants from options`}
            </Button>
          )}

        {product.variants.length > 1 && variantsToDelete.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="small"
              className="h-10 mt-base"
              type="button"
              onClick={() => reset()}
            >
              Reset Options
            </Button>
            <Button
              variant="danger"
              size="small"
              className="h-10 mt-base"
              type="button"
              onClick={() => deleteVariantsWithRemovedOptions()}
            >
              Delete variants with removed options
            </Button>
          </div>
        )}
      </div>

      <AddOptionModal
        product={product}
        open={addOptionModalOpen}
        onClose={() => {
          setAddOptionModalOpen(false)
          refetch()
        }}
      />
    </form>
  )
}

const getDefaultValues = (options: ProductOption[] | undefined) => {
  if (!options) {
    return {
      options: [],
    }
  }
  return {
    options: options.map((option) => ({
      title: option.title,
      id: option.id,
      values: option.values
        ? [...uniq(option.values.map((value) => value.value))]
        : [],
    })),
  }
}

export default OptionsForm
