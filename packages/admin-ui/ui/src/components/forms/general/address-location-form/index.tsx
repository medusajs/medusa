import { Controller } from "react-hook-form"
import { Option } from "../../../../types/shared"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"
import { NextSelect } from "../../../molecules/select/next-select"
import { useTranslation } from "react-i18next"

export type AddressLocationFormType = {
  address_1: string
  address_2: string | null
  city: string
  province: string | null
  country_code: Option
  postal_code: string
}

type AddressLocationFormProps = {
  requireFields?: Partial<Record<keyof AddressLocationFormType, boolean>>
  countryOptions?: Option[]
  form: NestedForm<AddressLocationFormType>
}

/**
 * Re-usable form for address location information, used to create and edit addresses.
 * Fields are optional, but can be required by passing in a requireFields object.
 */
const AddressLocationForm = ({
  form,
  countryOptions,
  requireFields,
}: AddressLocationFormProps) => {
  const {
    register,
    path,
    formState: { errors },
    control,
  } = form
  const { t } = useTranslation()

  return (
    <div className="gap-large grid grid-cols-2">
      <InputField
        {...register(path("address_1"), {
          required: requireFields?.address_1
            ? FormValidator.required(t("Address 1"))
            : false,
          pattern: FormValidator.whiteSpaceRule("Address 1"),
        })}
        placeholder={t("Address 1")}
        label={t("Address 1")}
        required={requireFields?.address_1}
        errors={errors}
      />
      <InputField
        {...register(path("address_2"), {
          pattern: FormValidator.whiteSpaceRule(t("Address 2")),
          required: requireFields?.address_2
            ? FormValidator.required("Address 2")
            : false,
        })}
        placeholder={t("Address 2")}
        required={requireFields?.address_2}
        label={t("Address 2")}
        errors={errors}
      />
      <InputField
        {...register(path("postal_code"), {
          required: requireFields?.postal_code
            ? FormValidator.required(t("Postal code"))
            : false,
          pattern: FormValidator.whiteSpaceRule("Postal code"),
        })}
        placeholder={t("Postal code")}
        label={t("Postal code")}
        required={requireFields?.postal_code}
        autoComplete="off"
        errors={errors}
      />
      <InputField
        placeholder={t("City")}
        label={t("City")}
        {...register(path("city"), {
          required: requireFields?.city
            ? FormValidator.required(t("City"))
            : false,
          pattern: FormValidator.whiteSpaceRule("City"),
        })}
        required={requireFields?.city}
        errors={errors}
      />
      <InputField
        {...register(path("province"), {
          pattern: FormValidator.whiteSpaceRule("Province"),
          required: requireFields?.province
            ? FormValidator.required(t("Province"))
            : false,
        })}
        placeholder={t("Province")}
        label={t("Province")}
        required={requireFields?.province}
        errors={errors}
      />
      <Controller
        control={control}
        name={path("country_code")}
        rules={{
          required: requireFields?.country_code
            ? FormValidator.required(t("Country"))
            : false,
        }}
        render={({ field: { value, onChange } }) => {
          return (
            <NextSelect
              label={t("Country")}
              required={requireFields?.country_code}
              value={value}
              options={countryOptions}
              onChange={onChange}
              name={path("country_code")}
              errors={errors}
              isClearable={!requireFields?.country_code}
            />
          )
        }}
      />
    </div>
  )
}

export default AddressLocationForm
