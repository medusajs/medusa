import React, { FC, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Vendor, Location } from "@medusajs/medusa"

import Input from "../../../../../components/molecules/input"
import BodyCard from "../../../../../components/organisms/body-card"
import useNotification from "../../../../../hooks/use-notification"
import {
  useAdminCreateLocation,
  useAdminUpdateLocation,
} from "../../../../../hooks/admin/locations"
import InputField from "../../../../../components/molecules/input"

export interface LocationFormProps {
  vendor: Vendor
  location?: Location | null
  onSave: () => void
}

interface LocationForm {
  name: string
  address: {
    first_name: string
    last_name: string
    company: string
    address_1: string
    address_2: string
    city: string
    province: string
    postal_code: string
    country_code: string
    phone: string
  }
  default: boolean
}

const defaultValues = {
  name: "",
  address: {
    first_name: "",
    last_name: "",
    company: "",
    metadata: {},
    address_1: "",
    address_2: "",
    city: "",
    province: "",
    postal_code: "",
    phone: "",
  },
}

export const LocationForm: FC<LocationFormProps> = ({
  vendor,
  location,
  onSave,
}) => {
  const createLocation = useAdminCreateLocation(vendor.id)
  const updateLocation = useAdminUpdateLocation(vendor.id, location?.id || "")
  const notification = useNotification()
  const form = useForm<LocationForm>()
  const { register, reset, handleSubmit } = form

  useEffect(() => {
    if (!location) return
    const { name } = location
    const { country_code, ...address } = location?.address
    reset({ ...defaultValues, address, name })
  }, [reset])

  const submitting = createLocation.isLoading || updateLocation.isLoading

  const handleCancel = () => {
    reset({ ...defaultValues, ...location })
  }

  const onSubmit = async (data: LocationForm) => {
    const submitData = {
      name: data.name,
      address: {
        first_name: data.address.first_name,
        last_name: data.address.last_name,
        company: data.address.company,
        address_1: data.address.address_1,
        address_2: data.address.address_2,
        city: data.address.city,
        province: data.address.province,
        postal_code: data.address.postal_code,
        phone: data.address.phone,
        country_code: "us",
        metadata: {},
      },
      default: true,
    }

    if (location) {
      return updateLocation.mutate(submitData, {
        onSuccess: () => {
          onSave()
          notification("Success", "Location Updated", "success")
        },
        onError: (error) => {
          if (error?.response?.data?.message) {
            notification("Failure", error?.response?.data?.message, "error")
          }
        },
      })
    }

    return createLocation.mutate(submitData, {
      onSuccess: () => {
        onSave()
        notification("Success", "Location Created", "success")
      },
      onError: (error) => {
        if (error?.response?.data?.message) {
          notification("Failure", error?.response?.data?.message, "error")
        }
      },
    })
  }
  return (
    <FormProvider {...form}>
      <form>
        <BodyCard
          events={[
            {
              label: "Save",
              type: "button",
              onClick: handleSubmit(onSubmit),
              disabled: submitting,
            },
            {
              label: "Cancel Changes",
              type: "button",
              onClick: handleCancel,
              disabled: submitting,
            },
          ]}
          title={`Location`}
          subtitle={`Manage the ship from location for ${vendor.name}`}
        >
          <h6 className="inter-base-semibold mt-0 mb-base">General</h6>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-base">
            <InputField
              label="Name"
              required
              placeholder="Give your location a name"
              {...register("name", { required: "Name is Required" })}
            />
          </div>

          <h6 className="inter-base-semibold mt-0 mb-base">Address</h6>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <InputField
              label="First Name"
              required
              placeholder="Enter First Name"
              {...register("address.first_name", {
                required: "First Name is required",
              })}
            />

            <InputField
              label="Last Name"
              required
              placeholder="Enter Last Name"
              {...register("address.last_name", {
                required: "Last Name is required",
              })}
            />

            <InputField
              label="Address 1"
              autoComplete="address-line1"
              required
              placeholder="First Address Line"
              {...register("address.address_1", {
                required: "First Address Line is required",
              })}
            />
            <InputField
              label="Address 2"
              placeholder="Second Address Line"
              {...register("address.address_2")}
            />

            <InputField
              label="City"
              required
              placeholder="City"
              {...register("address.city", { required: "City is required" })}
            />

            <InputField
              label="State/Province"
              required
              placeholder="State or Province"
              {...register("address.province", {
                required: "State or Province is required",
              })}
            />

            <InputField
              label="Postal Code"
              required
              placeholder="Enter Postal Code"
              {...register("address.postal_code", {
                required: "Postal Code is required",
              })}
            />

            <InputField
              label="Phone"
              required={true}
              placeholder="Enter Phone Number"
              {...register("address.phone", {
                required: "Phone number is required",
              })}
            />
          </div>
        </BodyCard>
      </form>
    </FormProvider>
  )
}
