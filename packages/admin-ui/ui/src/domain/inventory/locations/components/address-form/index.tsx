import { Country } from "@medusajs/medusa"
import { StockLocationAddressDTO } from "@medusajs/types"
import { useAdminRegions } from "medusa-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useWatch } from "react-hook-form"
import InputField from "../../../../../components/molecules/input"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import FormValidator from "../../../../../utils/form-validator"
import { NestedForm } from "../../../../../utils/nested-form"

const AddressForm = ({
  form,
}: {
  form: NestedForm<StockLocationAddressDTO>
}) => {
  const {
    register,
    path,
    formState: { errors },
    control,
  } = form

  const { regions } = useAdminRegions()

  const watchedAddressForm = useWatch({
    control,
    name: [
      path("company"),
      path("address_1"),
      path("address_2"),
      path("postal_code"),
      path("city"),
      path("country_code"),
    ],
  })

  const anyAddressFieldsFilled = watchedAddressForm.some((field) => !!field)

  const [addressFieldsRequired, setAddressFieldsRequired] = useState(false)

  useEffect(() => {
    setAddressFieldsRequired(!!anyAddressFieldsFilled)
  }, [anyAddressFieldsFilled])

  const countries = useMemo(() => {
    if (!regions) {
      return []
    }
    return regions
      .reduce(
        (countries, region) => [...countries, ...region.countries],
        [] as Country[]
      )
      .map((country) => ({
        label: country.display_name,
        value: country.iso_2,
      }))
  }, [regions])

  return (
    <>
      <span className="inter-base-semibold">Address</span>
      <div className="gap-y-large gap-x-large grid grid-cols-1">
        <div className="gap-x-large grid grid-cols-2">
          <InputField
            label="Company"
            placeholder="Company"
            errors={errors}
            {...register(path("company"), {
              pattern: FormValidator.whiteSpaceRule("Company"),
            })}
          />
        </div>
        <div className="gap-x-large grid grid-cols-2">
          <InputField
            label="Address 1"
            placeholder="Address 1"
            errors={errors}
            required={addressFieldsRequired}
            {...register(path("address_1"), {
              pattern: FormValidator.whiteSpaceRule("Address 1"),
              required: addressFieldsRequired
                ? "This field is required"
                : undefined,
            })}
          />
          <InputField
            label="Address 2"
            placeholder="Address 2"
            errors={errors}
            {...register(path("address_2"), {
              pattern: FormValidator.whiteSpaceRule("Address 2"),
            })}
          />
        </div>
        <div className="gap-x-large grid grid-cols-2">
          <InputField
            label="Postal code"
            placeholder="Postal code"
            errors={errors}
            {...register(path("postal_code"), {
              pattern: FormValidator.whiteSpaceRule("Postal code"),
            })}
          />
          <InputField
            label="City"
            placeholder="City"
            errors={errors}
            {...register(path("city"), {
              pattern: FormValidator.whiteSpaceRule("City"),
            })}
          />
        </div>
        <div className="gap-x-large grid grid-cols-2 pb-0.5">
          <Controller
            control={control}
            name={path("country_code")}
            rules={{
              required: addressFieldsRequired
                ? "This field is required"
                : undefined,
            }}
            render={({ field: { value, onChange } }) => {
              let fieldValue:
                | string
                | { value: string; label: string }
                | undefined = value

              if (typeof fieldValue === "string") {
                fieldValue = countries.find(
                  (country) => country.value === fieldValue
                )
              }

              return (
                <NextSelect
                  label="Country"
                  required={addressFieldsRequired}
                  value={fieldValue}
                  options={countries}
                  onChange={onChange}
                  name={path("country_code")}
                  errors={errors}
                  isClearable={!addressFieldsRequired}
                />
              )
            }}
          />
        </div>
      </div>
    </>
  )
}

export default AddressForm
