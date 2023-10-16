import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Option } from "../../types/shared"
import FormValidator from "../../utils/form-validator"
import { nestedForm, NestedForm } from "../../utils/nested-form"
import MetadataForm, { MetadataFormType } from "../forms/general/metadata-form"
import Input from "../molecules/input"
import { NextSelect } from "../molecules/select/next-select"

export type AddressPayload = {
  first_name: string
  last_name: string
  company: string | null
  address_1: string
  address_2: string | null
  city: string
  province: string | null
  country_code: Option
  postal_code: string
  phone: string | null
  metadata: MetadataFormType
}

export enum AddressType {
  SHIPPING = "shipping",
  BILLING = "billing",
  LOCATION = "location",
}

type AddressFormProps = {
  form: NestedForm<AddressPayload>
  countryOptions: Option[]
  type: AddressType
  required?: boolean
  noTitle?: boolean
}

const AddressForm = ({
  form,
  countryOptions,
  type,
  required = true,
  noTitle = false,
}: AddressFormProps) => {
  const {
    register,
    path,
    control,
    formState: { errors },
  } = form
  const { t } = useTranslation()
  return (
    <div>
      {(type === AddressType.SHIPPING || type === AddressType.BILLING) && (
        <>
          <span className="inter-base-semibold">
            {t("templates-general", "General")}
          </span>
          <div className="gap-large mt-4 mb-8 grid grid-cols-2">
            <Input
              {...register(path("first_name"), {
                required: required
                  ? FormValidator.required("First name")
                  : false,
                pattern: FormValidator.whiteSpaceRule("First name"),
              })}
              placeholder={t("templates-first-name", "First Name")}
              label={t("templates-first-name", "First Name")}
              required={required}
              errors={errors}
            />
            <Input
              {...form.register(path("last_name"), {
                required: required
                  ? FormValidator.required("Last name")
                  : false,
                pattern: FormValidator.whiteSpaceRule("Last name"),
              })}
              placeholder={t("templates-last-name", "Last Name")}
              label={t("templates-last-name", "Last Name")}
              required={required}
              errors={errors}
            />
            <Input
              {...form.register(path("company"), {
                pattern: FormValidator.whiteSpaceRule("Company"),
              })}
              placeholder={t("templates-company", "Company")}
              label={t("templates-company", "Company")}
              errors={errors}
            />
            <Input
              {...form.register(path("phone"))}
              placeholder={t("templates-phone", "Phone")}
              label={t("templates-phone", "Phone")}
              errors={errors}
            />
          </div>
        </>
      )}
      {!noTitle && (
        <span className="inter-base-semibold">
          {`${
            type === AddressType.BILLING
              ? t("templates-billing-address", "Billing Address")
              : type === AddressType.SHIPPING
              ? t("templates-shipping-address", "Shipping Address")
              : t("templates-address", "Address")
          }`}
        </span>
      )}
      <div className="gap-y-large gap-x-large mt-4 grid grid-cols-2">
        <Input
          {...form.register(path("address_1"), {
            required: required ? FormValidator.required("Address 1") : false,
            pattern: FormValidator.whiteSpaceRule("Address 1"),
          })}
          placeholder={t("templates-address-1", "Address 1")}
          label={t("templates-address-1", "Address 1")}
          required={required}
          errors={errors}
        />
        <Input
          {...form.register(path("address_2"), {
            pattern: FormValidator.whiteSpaceRule("Address 2"),
          })}
          placeholder={t("templates-address-2", "Address 2")}
          label={t("templates-address-2", "Address 2")}
          errors={errors}
        />
        <Input
          {...form.register(path("postal_code"), {
            required: required ? FormValidator.required("Postal code") : false,
            pattern: FormValidator.whiteSpaceRule("Postal code"),
          })}
          placeholder={t("templates-postal-code", "Postal code")}
          label={t("templates-postal-code", "Postal code")}
          required={required}
          autoComplete="off"
          errors={errors}
        />
        <Input
          placeholder={t("templates-city", "City")}
          label={t("templates-city", "City")}
          {...form.register(path("city"), {
            required: required ? FormValidator.required("City") : false,
            pattern: FormValidator.whiteSpaceRule("City"),
          })}
          required={required}
          errors={errors}
        />
        <Input
          {...form.register(path("province"), {
            pattern: FormValidator.whiteSpaceRule("Province"),
          })}
          placeholder={t("templates-province", "Province")}
          label={t("templates-province", "Province")}
          errors={errors}
        />
        <Controller
          control={control}
          name={path("country_code")}
          rules={{
            required: required ? FormValidator.required("Country") : false,
          }}
          render={({ field: { value, onChange } }) => {
            return (
              <NextSelect
                label={t("templates-country", "Country")}
                required={required}
                value={value}
                options={countryOptions}
                onChange={onChange}
                name={path("country_code")}
                errors={errors}
                isClearable={!required}
              />
            )
          }}
        />
      </div>
      <div className="mt-xlarge gap-y-base flex flex-col">
        <span className="inter-base-semibold">
          {t("templates-metadata", "Metadata")}
        </span>
        <MetadataForm form={nestedForm(form, "metadata")} />
      </div>
    </div>
  )
}
export default AddressForm
