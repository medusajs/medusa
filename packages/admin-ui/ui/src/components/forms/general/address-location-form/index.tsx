import { Controller } from "react-hook-form"
import { Option } from "../../../../types/shared"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"
import { NextSelect } from "../../../molecules/select/next-select"

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

  return (
    <div className="gap-y-large gap-x-large mt-4 grid grid-cols-2">
      <InputField
        {...form.register(path("address_1"), {
          required: required ? FormValidator.required("Address 1") : false,
          pattern: FormValidator.whiteSpaceRule("Address 1"),
        })}
        placeholder="Address 1"
        label="Address 1"
        required={required}
        errors={errors}
      />
      <InputField
        {...form.register(path("address_2"), {
          pattern: FormValidator.whiteSpaceRule("Address 2"),
        })}
        placeholder="Address 2"
        label="Address 2"
        errors={errors}
      />
      <InputField
        {...form.register(path("postal_code"), {
          required: required ? FormValidator.required("Postal code") : false,
          pattern: FormValidator.whiteSpaceRule("Postal code"),
        })}
        placeholder="Postal code"
        label="Postal code"
        required={required}
        autoComplete="off"
        errors={errors}
      />
      <InputField
        placeholder="City"
        label="City"
        {...form.register(path("city"), {
          required: required ? FormValidator.required("City") : false,
          pattern: FormValidator.whiteSpaceRule("City"),
        })}
        required={required}
        errors={errors}
      />
      <InputField
        {...form.register(path("province"), {
          pattern: FormValidator.whiteSpaceRule("Province"),
        })}
        placeholder="Province"
        label="Province"
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
              label="Country"
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
  )
}
