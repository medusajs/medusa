import { Region, Vendor } from "@medusajs/medusa"
import RadioGroup from "../../../../../components/organisms/radio-group"
import React, { useEffect } from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import IncludesTaxTooltip from "../../../../../components/atoms/includes-tax-tooltip"
import Switch from "../../../../../components/atoms/switch"
import InputHeader from "../../../../../components/fundamentals/input-header"
import InputField from "../../../../../components/molecules/input"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option, ShippingOptionPriceType } from "../../../../../types/shared"
import FormValidator from "../../../../../utils/form-validator"
import PriceFormInput from "../../../../products/components/prices-form/price-form-input"
import { useShippingOptionFormData } from "./use-shipping-option-form-data"
import { ShippingRateType } from "../../../../discounts/types"
import { transitTimeOptions } from "../../../../../definitions/shared"

type Requirement = {
  amount: number | null
  id: string | null
}

export type ShippingOptionFormType = {
  store_option: boolean
  name: string | null
  price_type: ShippingOptionPriceType | null
  amount: number | null
  shipping_profile: Option | null
  fulfillment_provider: Option | null
  fulfillment_method: Option | null
  transit_time: Option | null
  requirements: {
    min_subtotal: Requirement | null
    max_subtotal: Requirement | null
    min_weight: Requirement | null
    max_weight: Requirement | null
  }
}

type Props = {
  form: UseFormReturn<ShippingOptionFormType, any>
  region: Region
  vendor?: Vendor
  isEdit?: boolean
}

const priceTypeOptions: ShippingOptionPriceType[] = [
  { label: "Flat Rate", value: "flat_rate" },
  { label: "Free Shipping", value: "free_shipping" },
  { label: "Calculated", value: "calculated" },
]

const ShippingOptionForm = ({
  form,
  region,
  vendor,
  isEdit = false,
}: Props) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
    watch,
  } = form

  const setPriceTypeValue = (value: string) => {
    const optionValue = priceTypeOptions.find((o) => o.value === value)
    setValue("price_type", optionValue!)
  }

  const price_type = watch("price_type")
  const fulfillment_provider = watch("fulfillment_provider")

  const {
    shippingProfileOptions,
    fulfillmentOptions,
    fulfillmentProviderOptions,
    getFulfillmentData,
  } = useShippingOptionFormData({ regionId: region.id, vendorId: vendor?.id })

  useEffect(() => {
    if (!shippingProfileOptions) return
    if (shippingProfileOptions.length === 1)
      setValue("shipping_profile", shippingProfileOptions[0])
  }, [shippingProfileOptions])

  return (
    <div>
      <div className="mb-4">
        <div className="flex flex-col gap-y-2xsmall">
          <div className="flex items-center justify-between">
            <h3 className="inter-base-semibold mb-2xsmall">Visible in store</h3>
            <Controller
              control={control}
              name={"store_option"}
              render={({ field: { value, onChange } }) => {
                return <Switch checked={value} onCheckedChange={onChange} />
              }}
            />
          </div>
          <p className="inter-base-regular text-grey-50">
            Enable or disable the shipping option visiblity in store.
          </p>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="inter-base-semibold mb-2xsmall">Price Type</h3>
        {!isEdit && (
          <Controller
            control={control}
            name={"price_type"}
            render={({ field: { value, onChange } }) => {
              return (
                <RadioGroup.Root
                  value={value?.value}
                  onValueChange={setPriceTypeValue}
                  className="mt-base"
                >
                  <RadioGroup.Item
                    value={ShippingRateType.FREE_SHIPPING}
                    className="flex-1"
                    label="Free Shipping"
                    description={"Recommended"}
                  />
                  <RadioGroup.Item
                    value={ShippingRateType.CALCULATED}
                    className="flex-1"
                    label="Calculate Shipping Cost"
                    description={"Delivery cost will be dynamically calculated"}
                  />
                  <RadioGroup.Item
                    value={ShippingRateType.FLAT_RATE}
                    className="flex-1"
                    label="Charge Flat Rate"
                  />
                </RadioGroup.Root>
              )
            }}
          />
        )}
        {!!isEdit && (
          <p className="inter-base-regular text-grey-50">{price_type?.label}</p>
        )}
      </div>

      <div className="mb-4">
        <h3 className="inter-base-semibold mb-base">Details</h3>
        <div className="grid grid-cols-2 gap-large">
          {!isEdit && (
            <>
              {shippingProfileOptions.length > 1 && (
                <Controller
                  control={control}
                  name="shipping_profile"
                  rules={{ required: "Shipping Profile is required" }}
                  render={({ field }) => {
                    return (
                      <NextSelect
                        label="Shipping Profile"
                        required
                        options={shippingProfileOptions}
                        placeholder="Choose a shipping profile"
                        {...field}
                        errors={errors}
                      />
                    )
                  }}
                />
              )}
              <Controller
                control={control}
                name="fulfillment_provider"
                render={({ field: { onChange, value } }) => {
                  return (
                    <NextSelect
                      label="Fulfillment Provider"
                      required
                      value={value}
                      onChange={(value, action) => {
                        onChange(value, action)
                        setValue("fulfillment_method", null)
                      }}
                      options={fulfillmentProviderOptions}
                      placeholder="Choose a fulfillment provider"
                      errors={errors}
                    />
                  )
                }}
              />
              {!!fulfillment_provider && (
                <Controller
                  control={control}
                  name="fulfillment_method"
                  rules={{
                    required: "Fulfillment Method is required",
                    validate: (method) => {
                      if (method) {
                        const data = getFulfillmentData(method.value)
                        if (
                          data?.data?.can_calculate === false &&
                          price_type?.value === "calculated"
                        )
                          return "This fulfillment method does not support calculating shipping cost automatically"
                      }
                    },
                  }}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <NextSelect
                        label="Fulfillment Method"
                        required
                        value={value}
                        name="fulfillment_method"
                        onChange={(value, action) => {
                          onChange(value, action)
                          setValue("name", value?.label)
                          const data = getFulfillmentData(value?.value)
                          const transitTimeOption = transitTimeOptions.find(
                            (o) => o.value === data.data.transit_time
                          )
                          if (transitTimeOption)
                            setValue("transit_time", transitTimeOption)
                        }}
                        placeholder="Choose a fulfillment method"
                        options={fulfillmentOptions.filter(
                          (o) => o.provider_id === fulfillment_provider?.value
                        )}
                        errors={errors}
                      />
                    )
                  }}
                />
              )}
            </>
          )}
          <InputField
            label="Title"
            required
            {...register("name", {
              required: "Title is required",
              pattern: FormValidator.whiteSpaceRule("Title"),
              minLength: FormValidator.minOneCharRule("Title"),
            })}
            errors={errors}
          />

          <Controller
            control={control}
            name="transit_time"
            render={({ field }) => {
              return (
                <NextSelect
                  label="Transit Time"
                  required
                  options={transitTimeOptions}
                  placeholder="Choose a transit time"
                  errors={errors}
                  {...field}
                />
              )
            }}
          />

          {price_type?.value === ShippingRateType.FLAT_RATE && (
            <Controller
              control={control}
              name="amount"
              rules={{
                min: FormValidator.nonNegativeNumberRule("Price"),
                max: FormValidator.maxInteger("Price", region.currency_code),
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <div>
                    <InputHeader
                      label="Price"
                      className="mb-xsmall"
                      tooltip={
                        <IncludesTaxTooltip includesTax={region.includes_tax} />
                      }
                    />
                    <PriceFormInput
                      amount={value || undefined}
                      onChange={onChange}
                      name="amount"
                      currencyCode={region.currency_code}
                      errors={errors}
                    />
                  </div>
                )
              }}
            />
          )}
        </div>
      </div>

      <div>
        <h3 className="inter-base-semibold mb-base">Requirements</h3>
        <div className="grid grid-cols-2 gap-large">
          <Controller
            control={control}
            name="requirements.min_subtotal.amount"
            rules={{
              min: FormValidator.nonNegativeNumberRule("Min. subtotal"),
              max: FormValidator.maxInteger(
                "Min. subtotal",
                region.currency_code
              ),
              validate: (value) => {
                if (!value) {
                  return true
                }

                const maxSubtotal = form.getValues(
                  "requirements.max_subtotal.amount"
                )
                if (maxSubtotal && value > maxSubtotal) {
                  return "Min. subtotal must be less than max. subtotal"
                }
                return true
              },
            }}
            render={({ field: { value, onChange } }) => {
              return (
                <div>
                  <InputHeader
                    label="Min. subtotal"
                    className="mb-xsmall"
                    tooltip={
                      <IncludesTaxTooltip includesTax={region.includes_tax} />
                    }
                  />
                  <PriceFormInput
                    amount={value || undefined}
                    onChange={onChange}
                    name="requirements.min_subtotal.amount"
                    currencyCode={region.currency_code}
                    errors={errors}
                  />
                </div>
              )
            }}
          />
          <Controller
            control={control}
            name="requirements.max_subtotal.amount"
            rules={{
              min: FormValidator.nonNegativeNumberRule("Max. subtotal"),
              max: FormValidator.maxInteger(
                "Max. subtotal",
                region.currency_code
              ),
              validate: (value) => {
                if (!value) {
                  return true
                }

                const minSubtotal = form.getValues(
                  "requirements.min_subtotal.amount"
                )
                if (minSubtotal && value < minSubtotal) {
                  return "Max. subtotal must be greater than min. subtotal"
                }
                return true
              },
            }}
            render={({ field: { value, onChange, ref } }) => {
              return (
                <div ref={ref}>
                  <InputHeader
                    label="Max. subtotal"
                    className="mb-xsmall"
                    tooltip={
                      <IncludesTaxTooltip includesTax={region.includes_tax} />
                    }
                  />
                  <PriceFormInput
                    amount={value || undefined}
                    onChange={onChange}
                    name="requirements.max_subtotal.amount"
                    currencyCode={region.currency_code}
                    errors={errors}
                  />
                </div>
              )
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-large pt-2">
          <InputField
            label="Min Weight (oz)"
            type="number"
            errors={errors}
            {...register("requirements.min_weight.amount", {
              valueAsNumber: true,
              min: FormValidator.nonNegativeNumberRule("Min. weight"),
              max: FormValidator.maxInteger(
                "Min. weight",
                region.currency_code
              ),
              validate: (value) => {
                if (!value) {
                  return true
                }

                const maxWeight = form.getValues(
                  "requirements.max_weight.amount"
                )

                if (maxWeight && value > maxWeight)
                  return "Min. weight must be less than max. weight"

                return true
              },
            })}
          />

          <InputField
            label="Max Weight (oz)"
            type="number"
            errors={errors}
            {...register("requirements.max_weight.amount", {
              valueAsNumber: true,
              min: FormValidator.nonNegativeNumberRule("Min. weight"),
              max: FormValidator.maxInteger("Max. weight"),
              validate: (value) => {
                if (!value) {
                  return true
                }

                const minWeight = form.getValues(
                  "requirements.min_weight.amount"
                )

                if (minWeight && value < minWeight)
                  return "Max. weight must be greater than min. weight"

                return true
              },
            })}
          />
        </div>
      </div>
    </div>
  )
}

export default ShippingOptionForm
