import { Discount } from "@medusajs/medusa"
import { useAdminRegions } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Checkbox from "../../../../../components/atoms/checkbox"
import IconTooltip from "../../../../../components/molecules/icon-tooltip"
import InputField from "../../../../../components/molecules/input"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import TextArea from "../../../../../components/molecules/textarea"
import CurrencyInput from "../../../../../components/organisms/currency-input"
import { useDiscountForm } from "../form/discount-form-context"

type GeneralProps = {
  discount?: Discount
}

const General: React.FC<GeneralProps> = ({ discount }) => {
  const initialCurrency = discount?.regions?.[0].currency_code || undefined

  const { t } = useTranslation()
  const [fixedRegionCurrency, setFixedRegionCurrency] = useState<
    string | undefined
  >(initialCurrency)

  const { regions: opts, isLoading } = useAdminRegions()
  const { register, control, type } = useDiscountForm()

  const regions = useWatch({
    control,
    name: "regions",
  })

  useEffect(() => {
    if (type === "fixed" && regions) {
      let id: string

      if (Array.isArray(regions) && regions.length) {
        id = regions[0].value
      } else {
        id = (regions as unknown as { label: string; value: string }).value // if you change from fixed to percentage, unselect and select a region, and then change back to fixed it is possible to make useForm set regions to an object instead of an array
      }

      const reg = opts?.find((r) => r.id === id)

      if (reg) {
        setFixedRegionCurrency(reg.currency_code)
      }
    }
  }, [type, opts, regions])

  const regionOptions = useMemo(() => {
    return opts?.map((r) => ({ value: r.id, label: r.name })) || []
  }, [opts])

  return (
    <div className="pt-5">
      {!isLoading && (
        <>
          <Controller
            name="regions"
            control={control}
            rules={{
              required: t(
                "sections-at-least-one-region-is-required",
                "At least one region is required"
              ),
              validate: (value) =>
                Array.isArray(value) ? value.length > 0 : !!value,
            }}
            render={({ field: { onChange, value } }) => {
              return (
                <NextSelect
                  value={value || null}
                  onChange={(value) => {
                    onChange(type === "fixed" ? [value] : value)
                  }}
                  label={t(
                    "sections-choose-valid-regions",
                    "Choose valid regions"
                  )}
                  isMulti={type !== "fixed"}
                  selectAll={type !== "fixed"}
                  isSearchable
                  required
                  options={regionOptions}
                />
              )
            }}
          />
          <div className="gap-x-base gap-y-base my-base flex">
            <InputField
              label={t("sections-code", "Code")}
              className="flex-1"
              placeholder={t("sections-summersale-10", "SUMMERSALE10")}
              required
              {...register("code", {
                required: t("sections-code-is-required", "Code is required"),
              })}
            />

            {type !== "free_shipping" && (
              <>
                {type === "fixed" ? (
                  <div className="flex-1">
                    <CurrencyInput.Root
                      size="small"
                      currentCurrency={fixedRegionCurrency}
                      readOnly
                      hideCurrency
                    >
                      <Controller
                        name="rule.value"
                        control={control}
                        rules={{
                          required: t(
                            "sections-amount-is-required",
                            "Amount is required"
                          ),
                          min: 1,
                        }}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <CurrencyInput.Amount
                              label={t("sections-amount", "Amount")}
                              required
                              amount={value}
                              onChange={onChange}
                            />
                          )
                        }}
                      />
                    </CurrencyInput.Root>
                  </div>
                ) : (
                  <div className="flex-1">
                    <InputField
                      label={t("sections-percentage", "Percentage")}
                      min={0}
                      required
                      type="number"
                      placeholder="10"
                      prefix={"%"}
                      {...register("rule.value", {
                        required: true,
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="text-grey-50 inter-small-regular mb-6 flex flex-col">
            <span>
              {t(
                "sections-customer-invoice-code",
                "The code your customers will enter during checkout. This will appear on your customer\u2019s invoice."
              )}
            </span>
            <span>
              {t(
                "sections-uppercase-letters-and-numbers-only",
                "Uppercase letters and numbers only."
              )}
            </span>
          </div>
          <TextArea
            label={t("sections-description", "Description")}
            required
            placeholder={t("sections-summer-sale-2022", "Summer Sale 2022")}
            rows={1}
            {...register("rule.description", {
              required: true,
            })}
          />
          <div className="mt-xlarge flex items-center">
            <Controller
              name="is_dynamic"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Checkbox
                    label={t(
                      "sections-this-is-a-template-discount",
                      "This is a template discount"
                    )}
                    name="is_dynamic"
                    id="is_dynamic"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )
              }}
            />
            <IconTooltip
              content={t(
                "sections-template-discounts-description",
                "Template discounts allow you to define a set of rules that can be used across a group of discounts. This is useful in campaigns that should generate unique codes for each user, but where the rules for all unique codes should be the same."
              )}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default General
