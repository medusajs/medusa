import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Switch from "../../../../../components/atoms/switch"
import FeatureToggle from "../../../../../components/fundamentals/feature-toggle"
import InputField from "../../../../../components/molecules/input"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option } from "../../../../../types/shared"
import FormValidator from "../../../../../utils/form-validator"
import { NestedForm } from "../../../../../utils/nested-form"
import { useStoreData } from "./use-store-data"

export type RegionDetailsFormType = {
  name: string
  countries: Option[]
  currency_code: Option
  tax_rate: number | null
  tax_code: string | null
  includes_tax?: boolean
}

type Props = {
  isCreate?: boolean
  form: NestedForm<RegionDetailsFormType>
}

const RegionDetailsForm = ({ form, isCreate = false }: Props) => {
  const {
    control,
    register,
    path,
    formState: { errors },
  } = form
  const { currencyOptions, countryOptions } = useStoreData()
  const { t } = useTranslation()

  return (
    <div>
      <div className="gap-large grid grid-cols-2">
        <InputField
          label={t("region-form-title", "Title")}
          placeholder={t("region-form-europe", "Europe")}
          required
          {...register(path("name"), {
            required: "Title is required",
            minLength: FormValidator.minOneCharRule("Title"),
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
          errors={errors}
        />
        <Controller
          control={control}
          name={path("currency_code")}
          rules={{
            required: t(
              "region-form-currency-code-is-required",
              "Currency code is required"
            ),
          }}
          render={({ field }) => {
            return (
              <NextSelect
                label={t("region-form-currency", "Currency")}
                placeholder={t(
                  "region-form-choose-currency",
                  "Choose currency"
                )}
                required
                {...field}
                options={currencyOptions}
                name={path("currency_code")}
                errors={errors}
              />
            )
          }}
        />
        {isCreate && (
          <>
            <InputField
              label={t("region-form-default-tax-rate", "Default Tax Rate")}
              required
              placeholder="25"
              prefix="%"
              step={1}
              type={"number"}
              {...register(path("tax_rate"), {
                required: isCreate
                  ? t(
                      "region-form-tax-rate-is-required",
                      "Tax rate is required"
                    )
                  : undefined,
                max: {
                  value: 100,
                  message: t(
                    "region-form-tax-rate-must-be-equal-to-or-less-than-100",
                    "Tax rate must be equal to or less than 100"
                  ),
                },
                min: FormValidator.nonNegativeNumberRule("Tax rate"),
                valueAsNumber: true,
              })}
              errors={errors}
            />
            <InputField
              label={t("region-form-default-tax-code", "Default Tax Code")}
              placeholder="1000"
              {...register(path("tax_code"))}
              errors={errors}
            />
          </>
        )}
        <Controller
          control={control}
          name={path("countries")}
          render={({ field }) => {
            return (
              <NextSelect
                label={t("region-form-countries", "Countries")}
                placeholder={t(
                  "region-form-choose-countries",
                  "Choose countries"
                )}
                isMulti
                selectAll
                {...field}
                name={path("countries")}
                errors={errors}
                options={countryOptions}
              />
            )
          }}
        />
      </div>
      <FeatureToggle featureFlag="tax_inclusive_pricing">
        <div className="mt-xlarge flex items-start justify-between">
          <div className="gap-y-2xsmall flex flex-col">
            <h3 className="inter-base-semibold">
              {t("region-form-tax-inclusive-prices", "Tax inclusive prices")}
            </h3>
            <p className="inter-base-regular text-grey-50">
              {t(
                "region-form-when-enabled-region-prices-will-be-tax-inclusive",
                "When enabled region prices will be tax inclusive."
              )}
            </p>
          </div>
          <Controller
            control={control}
            name={path("includes_tax")}
            render={({ field: { value, onChange } }) => {
              return <Switch checked={value} onCheckedChange={onChange} />
            }}
          />
        </div>
      </FeatureToggle>
    </div>
  )
}

export default RegionDetailsForm
