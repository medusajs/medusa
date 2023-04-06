import { Region } from "@medusajs/medusa"
import { Controller, UseFormReturn } from "react-hook-form"
import IncludesTaxTooltip from "../../../../../components/atoms/includes-tax-tooltip"
import Switch from "../../../../../components/atoms/switch"
import MetadataForm, {
  MetadataFormType,
} from "../../../../../components/forms/general/metadata-form"
import PriceFormInput from "../../../../../components/forms/general/prices-form/price-form-input"
import InputHeader from "../../../../../components/fundamentals/input-header"
import InputField from "../../../../../components/molecules/input"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option, ShippingOptionPriceType } from "../../../../../types/shared"
import FormValidator from "../../../../../utils/form-validator"
import { nestedForm } from "../../../../../utils/nested-form"
import { useShippingOptionFormData } from "./use-shipping-option-form-data"

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
  requirements: {
    min_subtotal: Requirement | null
    max_subtotal: Requirement | null
  }
  metadata: MetadataFormType
}

type Props = {
  form: UseFormReturn<ShippingOptionFormType, any>
  region: Region
  isEdit?: boolean
}

const ShippingOptionForm = ({ form, region, isEdit = false }: Props) => {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = form

  const { shippingProfileOptions, fulfillmentOptions } =
    useShippingOptionFormData(region.id)

  return (
    <div>
      <div>
        <div className="gap-y-2xsmall flex flex-col">
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
      <div className="bg-grey-20 my-xlarge h-px w-full" />
      <div>
        <h3 className="inter-base-semibold mb-base">Details</h3>
        <div className="gap-large grid grid-cols-2">
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
          <div className="gap-large flex items-center">
            <Controller
              control={control}
              name="price_type"
              render={({ field: { onChange, value, onBlur } }) => {
                return (
                  <NextSelect
                    label="Price Type"
                    required
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    options={[
                      {
                        label: "Flat Rate",
                        value: "flat_rate",
                      },
                      {
                        label: "Calculated",
                        value: "calculated",
                      },
                    ]}
                    placeholder="Choose a price type"
                    errors={errors}
                  />
                )
              }}
            />
            {watch("price_type")?.value === "flat_rate" && (
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
                        className="mb-2xsmall"
                        tooltip={
                          <IncludesTaxTooltip
                            includesTax={region.includes_tax}
                          />
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

          {!isEdit && (
            <>
              <Controller
                control={control}
                name="shipping_profile"
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
              <Controller
                control={control}
                name="fulfillment_provider"
                render={({ field }) => {
                  return (
                    <NextSelect
                      label="Fulfillment Method"
                      required
                      placeholder="Choose a fulfillment method"
                      options={fulfillmentOptions}
                      {...field}
                      errors={errors}
                    />
                  )
                }}
              />
            </>
          )}
        </div>
      </div>
      <div className="bg-grey-20 my-xlarge h-px w-full" />
      <div>
        <h3 className="inter-base-semibold mb-base">Requirements</h3>
        <div className="gap-large grid grid-cols-2">
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
                if (value === null) {
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
                    amount={typeof value === "number" ? value : undefined}
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
                if (value === null) {
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
                    amount={typeof value === "number" ? value : undefined}
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
      </div>
      <div className="bg-grey-20 my-xlarge h-px w-full" />
      <div>
        <h3 className="inter-base-semibold mb-base">Metadata</h3>
        <MetadataForm form={nestedForm(form, "metadata")} />
      </div>
    </div>
  )
}

export default ShippingOptionForm
