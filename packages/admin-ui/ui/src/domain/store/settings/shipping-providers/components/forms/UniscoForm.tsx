import React, { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Checkbox from "../../../../../../components/atoms/checkbox"
import Spinner from "../../../../../../components/atoms/spinner"
import Input from "../../../../../../components/molecules/input"
import BodyCard from "../../../../../../components/organisms/body-card"

import useNotification from "../../../../../../hooks/use-notification"
import { useGetUniscoConfig } from "../../../../../../hooks/admin/unisco/unisco-queries"
import {
  useAdminCreateUnicoConfig,
  useAdminUpdateUniscoConfig,
} from "../../../../../../hooks/admin/unisco/unisco-mutations"
import { ShippingProviderDetails } from "../../../../../../definitions/shipping-providers"

export interface UniscoFormProps {
  shippingProvider: ShippingProviderDetails // TODO: Need shipping provider type.
}

interface UniscoFormValues {
  username: string
  password: string
  unisco_base_url: string
  unisco_company_id: string
  unisco_customer_id: string
  unisco_facility_id: string
  automatically_fulfill_orders: boolean
}

const defaultValues = {
  automatically_fulfill_orders: true,
}

export const UniscoForm: FC<UniscoFormProps> = ({ shippingProvider }) => {
  const configQuery = useGetUniscoConfig()
  const updateConfig = useAdminUpdateUniscoConfig()
  const createConfig = useAdminCreateUnicoConfig()
  const notification = useNotification()

  const { register, reset, handleSubmit, setValue, control } = useForm<
    UniscoFormValues
  >()

  const dataLoading = !shippingProvider || configQuery?.isLoading

  const config = configQuery.config

  const handleReset = () => {
    if (!config) return reset({ ...defaultValues })

    const {
      username,
      password,
      unisco_base_url,
      unisco_company_id,
      unisco_customer_id,
      unisco_facility_id,
      automatically_fulfill_orders,
    } = config

    reset({
      ...defaultValues,
      username,
      password,
      unisco_base_url,
      unisco_company_id,
      unisco_customer_id,
      unisco_facility_id,
      automatically_fulfill_orders,
    })
  }

  useEffect(() => {
    if (dataLoading) return

    handleReset()
  }, [config, reset])

  if (dataLoading) return <Spinner size="large" variant="secondary" />

  const submitting = createConfig.isLoading || updateConfig.isLoading

  const handleCancel = () => {
    handleReset()
  }

  const onSubmit = async (data: UniscoFormValues) => {
    if (!config) {
      return createConfig.mutate(
        {
          ...data,
        },
        {
          onSuccess: () => {
            configQuery.refetch()
            notification("Success", "Unisco Integration Configured", "success")
          },
          onError: (error) => {
            notification("Faulure", error?.response?.data?.message, "error")
          },
        }
      )
    }

    return updateConfig.mutate(data, {
      onSuccess: () => {
        configQuery.refetch()
        notification("Success", "Unisco Integration Updated", "success")
      },
      onError: (error) => {
        if (error?.response?.data?.message) {
          notification("Failure", error?.response?.data?.message, "error")
        }
      },
    })
  }

  return (
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
        title={`${shippingProvider.name}`}
        subtitle={`Configure the ${shippingProvider.name} integration.`}
      >
        <h6 className="inter-base-semibold mt-0 mb-base">General</h6>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <Input
            label="Username"
            required
            placeholder="Enter your username"
            {...register("username", { required: "username is required" })}
          />
          <Input
            label="Password"
            required
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: "Password is required" })}
          />

          <Input
            label="API URL"
            placeholder="https://api.unisco.com"
            {...register("unisco_base_url")}
          />

          <Input
            label="Company ID"
            placeholder="Enter your Company ID"
            {...register("unisco_company_id", {
              required: "Company ID is required",
            })}
          />

          <Input
            label="Customer ID"
            placeholder="Enter your Customer ID"
            {...register("unisco_customer_id", {
              required: "Customer ID is required",
            })}
          />

          <Input
            label="Facility ID"
            placeholder="Enter your Facility ID"
            {...register("unisco_facility_id", {
              required: "Facility ID is required",
            })}
          />
          <Checkbox
            label="Automatically Fulfill Orders"
            {...register("automatically_fulfill_orders")}
          />
        </div>
      </BodyCard>
    </form>
  )
}
