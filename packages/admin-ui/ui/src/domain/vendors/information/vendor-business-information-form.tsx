import React from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { Vendor } from "@medusajs/medusa"
import { getErrorMessage } from "../../../utils/error-messages"
import { NextSelect } from "../../../components/molecules/select/next-select"
import { useStoreData } from "../../settings/regions/components/region-form/use-store-data"
import FormValidator from "../../../utils/form-validator"
import InputField from "../../../components/molecules/input"
import Button from "../../../components/fundamentals/button"
import { useAdminUpdateVendor } from "../../../hooks/admin/vendors"
import { Option } from "../../../types/shared"

type VendorFormProps = {
  vendor: Vendor
}

interface VendorBusinessInformationForm {
  email: string
  country_code: Option
}

export const BusinessInformationVendorForm: React.FC<VendorFormProps> = ({
  vendor,
}) => {
  const notification = useNotification()
  const { countryOptions } = useStoreData()
  const updateVendor = useAdminUpdateVendor(vendor.id)
  const defaultValues: Partial<VendorBusinessInformationForm> = {
    email: vendor.email,
    country_code: countryOptions.find((c) => c.value === vendor.country_code),
  }

  const form = useForm<VendorBusinessInformationForm>({ defaultValues })
  const { register, handleSubmit, control } = form

  const submitForm = (formData: VendorBusinessInformationForm) => {
    const data = {
      id: vendor.id,
      email: formData.email,
      country_code: formData.country_code.value,
    }

    return updateVendor.mutate(data, {
      onSuccess: ({ data }) => {
        notification("Success", "Vendor details updated", "success")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <div className="flex ">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="mb-3">
            <Controller
              control={control}
              name={"country_code"}
              rules={{
                required: FormValidator.required("Country"),
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <NextSelect
                    label={`What is the primary country where ${vendor.name} operates?`}
                    required={true}
                    value={value}
                    options={countryOptions}
                    onChange={onChange}
                    name={"country_code"}
                  />
                )
              }}
            />
          </div>
          <div className="mb-4">
            <InputField
              label={`What is a good contact email for ${vendor.name}?`}
              placeholder="Enter email address"
              required
              {...register("email", {
                required: "Email is required",
              })}
            />
          </div>
          <div className="flex items-center justify-end w-full gap-2">
            <Button variant="primary" size="small">
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
