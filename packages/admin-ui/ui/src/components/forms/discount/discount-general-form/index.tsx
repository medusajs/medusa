import clsx from "clsx"
import { useAdminRegions } from "medusa-react"
import { useMemo } from "react"
import { Controller, useWatch } from "react-hook-form"
import { Option } from "../../../../types/shared"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputError from "../../../atoms/input-error"
import IconTooltip from "../../../molecules/icon-tooltip"
import IndeterminateCheckbox from "../../../molecules/indeterminate-checkbox"
import InputField from "../../../molecules/input"
import { NextSelect } from "../../../molecules/select/next-select"
import TextArea from "../../../molecules/textarea"
import PriceFormInput from "../../general/prices-form/price-form-input"

type DiscountRegionOption = Option & {
  currency_code: string
}

enum DiscountRuleType {
  FIXED = "fixed",
  PERCENTAGE = "percentage",
  FREE_SHIPPING = "free_shipping",
}

export type DiscountGeneralFormType = {
  region_ids: DiscountRegionOption[]
  code: string
  value?: number
  description: string
  is_dynamic?: boolean
}

type DiscountGeneralFormProps = {
  form: NestedForm<DiscountGeneralFormType>
  type: DiscountRuleType
  isEdit?: boolean
}

const DiscountGeneralForm = ({
  form,
  type,
  isEdit,
}: DiscountGeneralFormProps) => {
  const {
    register,
    path,
    control,
    formState: { errors },
  } = form

  const { regions } = useAdminRegions()

  const regionOptions = useMemo(() => {
    return (
      regions?.map((r) => ({
        value: r.id,
        label: r.name,
        currency_code: r.currency_code,
      })) || []
    )
  }, [regions])

  const selectedRegionCurrency = useWatch({
    control,
    name: path("region_ids.0.currency_code"),
    defaultValue: "usd",
  })

  return (
    <div className="gap-y-large flex flex-col">
      <Controller
        name={path("region_ids")}
        control={control}
        rules={{
          required: FormValidator.required("Regions"),
        }}
        render={({ field: { value, onChange, name, ref } }) => {
          return (
            <NextSelect
              name={name}
              ref={ref}
              value={value}
              onChange={(value) => {
                onChange(type === DiscountRuleType.FIXED ? [value] : value)
              }}
              label="Choose valid regions"
              isMulti={type !== DiscountRuleType.FIXED}
              selectAll={type !== DiscountRuleType.FIXED}
              isSearchable
              required
              options={regionOptions}
              errors={errors}
            />
          )
        }}
      />
      <div>
        <div
          className={clsx("gap-small grid", {
            "grid-cols-2":
              type === DiscountRuleType.FIXED ||
              type === DiscountRuleType.PERCENTAGE,
            "grid-cols-1": type === DiscountRuleType.FREE_SHIPPING,
          })}
        >
          <InputField
            label="Code"
            required
            errors={errors}
            {...register(path("code"), {
              required: FormValidator.required("Code"),
            })}
          />
          {type === DiscountRuleType.FIXED ? (
            <Controller
              name={path("value")}
              rules={{
                required: FormValidator.required("Amount"),
                shouldUnregister: true,
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <PriceFormInput
                    label="Amount"
                    amount={value}
                    onChange={onChange}
                    currencyCode={selectedRegionCurrency}
                    errors={errors}
                  />
                )
              }}
            />
          ) : type === DiscountRuleType.PERCENTAGE ? (
            <InputField
              label="Percentage"
              placeholder="Percentage"
              errors={errors}
              prefix="%"
              required
              {...register(path("value"), {
                valueAsNumber: true,
                required: FormValidator.required("Percentage"),
                shouldUnregister: true,
              })}
            />
          ) : null}
        </div>
        <p className="inter-small-regular text-grey-50 mt-small max-w-[60%]">
          The code your customers will enter during checkout. This will appear
          on your customer&apos;s invoice. Uppercase letters and numbers only.
        </p>
      </div>
      <div>
        <TextArea
          label="Description"
          errors={errors}
          required
          {...register(path("description"), {
            required: FormValidator.required("Description"),
          })}
        />
      </div>
      {!isEdit && (
        <div>
          <Controller
            name={path("is_dynamic")}
            control={control}
            render={({ field: { value, onChange, ref } }) => {
              return (
                <div>
                  <div className="flex items-center">
                    <IndeterminateCheckbox
                      checked={value}
                      onChange={onChange}
                      ref={ref}
                    />
                    <p className="ms-small me-xsmall">Template discount</p>
                    <IconTooltip content="Template discounts allow you to define a set of rules that can be used across a group of discounts. This is useful in campaigns that should generate unique codes for each user, but where the rules for all unique codes should be the same." />
                  </div>
                  <InputError errors={errors} name={path("is_dynamic")} />
                </div>
              )
            }}
          />
        </div>
      )}
    </div>
  )
}

export default DiscountGeneralForm
