import { MoneyAmount, ProductVariant } from "@medusajs/medusa"
import React from "react"
import { Control, Controller, useForm, useWatch } from "react-hook-form"
import Checkbox, { CheckboxProps } from "../../atoms/checkbox"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import RadioGroup from "../../organisms/radio-group"
import PriceAmount from "./price-amount"

const MODES = {
  APPLY_ALL: "all",
  SELECTED_ONLY: "selected",
}

export type PriceOverridesFormValues = {
  variants: string[]
  prices: MoneyAmount[]
}

type PriceOverridesType = {
  onClose: () => void
  prices: MoneyAmount[]
  variants: ProductVariant[]
  onSubmit: (values: PriceOverridesFormValues) => void
  defaultVariant?: ProductVariant
  isEdit?: boolean
}

// TODO: Clean up this components typing to avoid circular dependencies
const PriceOverrides = ({
  onClose,
  prices,
  variants,
  onSubmit,
  defaultVariant,
  isEdit = false,
}: PriceOverridesType) => {
  const [mode, setMode] = React.useState(MODES.SELECTED_ONLY)
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<PriceOverridesFormValues>({
    defaultValues: {
      variants: [],
      prices: prices,
    },
  })

  const onClick = handleSubmit((values) => {
    if (mode === MODES.APPLY_ALL) {
      onSubmit({
        ...values,
        variants: variants?.map((variant) => variant.id),
      })
    } else {
      onSubmit({
        ...values,
        // remove null or undefined
        variants: values.variants?.filter(Boolean),
      })
    }
  })

  // set default variant
  React.useEffect(() => {
    if (prices.length > 0 && variants?.length > 0) {
      const selectedVariantId = defaultVariant
        ? defaultVariant.id
        : prices[0]?.variant_id
      const selectedIndex = variants.findIndex(
        (variant) => variant.id === selectedVariantId
      )
      const variantOptions = Array(variants.length).fill(null)
      variantOptions[selectedIndex] = selectedVariantId
      reset({
        prices,
        variants: variantOptions,
      })
    }
  }, [variants, prices, defaultVariant])

  return (
    <>
      <Modal.Content>
        {!isEdit && (
          <RadioGroup.Root
            value={mode}
            onValueChange={(value) => setMode(value)}
            className="pt-2 flex items-center"
          >
            <RadioGroup.SimpleItem
              value={MODES.SELECTED_ONLY}
              label="Apply overrides on selected variants"
            />
            <RadioGroup.SimpleItem
              value={MODES.APPLY_ALL}
              label="Apply on all variants"
            />
          </RadioGroup.Root>
        )}
        {mode === MODES.SELECTED_ONLY && !isEdit && (
          <div className="pt-6 flex flex-col gap-2">
            {variants.map((variant, idx) => (
              <div
                id={variant.id}
                className="py-2.5 px-3 border border-grey-20 rounded-rounded"
              >
                <ControlledCheckbox
                  control={control}
                  name="variants"
                  label={`${variant.title} (SKU: ${variant.sku})`}
                  id={variant.id}
                  index={idx}
                  value={variant.id}
                />
              </div>
            ))}
          </div>
        )}
        <div className="pt-8">
          <h6 className="inter-base-semibold">Prices</h6>
          <div className="pt-4">
            {prices.map((price, idx) => (
              <Controller
                control={control}
                name={`prices.${idx}`}
                key={price.id}
                render={({ field }) => {
                  return (
                    <PriceAmount
                      value={field.value}
                      key={price.id}
                      onChange={(amount) => {
                        field.onChange({
                          ...field.value,
                          amount,
                        })
                      }}
                    />
                  )
                }}
              />
            ))}
          </div>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="flex w-full h-8 justify-end">
          <Button
            variant="ghost"
            className="mr-2 w-32 text-small justify-center rounded-rounded"
            size="large"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="large"
            className="text-small justify-center rounded-rounded"
            variant="primary"
            onClick={onClick}
            loading={isSubmitting}
          >
            Save and close
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

type ControlledCheckboxProps = {
  control: Control
  name: string
  id: string
  index: number
} & CheckboxProps

const ControlledCheckbox = ({
  control,
  name,
  id,
  index,
  value,
  ...props
}: ControlledCheckboxProps) => {
  const variants = useWatch({
    control,
    name,
  })

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <Checkbox
            className="shrink-0 inter-small-regular"
            {...props}
            {...field}
            checked={variants?.some((variant) => variant === value)}
            onChange={(e) => {
              // copy field value
              const valueCopy = [...(variants || [])] as any[]

              // update checkbox value
              valueCopy[index] = e.target.checked ? id : null

              // update field value
              field.onChange(valueCopy)
            }}
          />
        )
      }}
    />
  )
}

export default PriceOverrides
