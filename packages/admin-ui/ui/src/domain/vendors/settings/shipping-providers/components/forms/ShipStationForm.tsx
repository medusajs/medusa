import { Vendor } from "@medusajs/medusa"
import { FC, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import Checkbox from "../../../../../../components/atoms/checkbox"
import Spinner from "../../../../../../components/atoms/spinner"
import Input from "../../../../../../components/molecules/input"
import Select from "../../../../../../components/molecules/select"
import BodyCard from "../../../../../../components/organisms/body-card"
import {
  useAdminCreateShipStationConfig,
  useAdminUpdateShipStationConfig,
  useGetShipStationConfig,
  useGetShipStationStores,
} from "../../../../../../hooks/admin"
import useNotification from "../../../../../../hooks/use-notification"
import { Option } from "../../../../../../types/shared"

export interface ShipStationFormProps {
  vendor: Vendor
  shippingProvider: any // TODO: Need shipping provider type.
}

interface ShipStationFormValues {
  api_key: string
  api_secret: string
  shipstation_store_id: Option
  shipstation_branding_id: string
  automatically_fulfill_orders: boolean
}

const defaultValues = {
  api_key: "",
  api_secret: "",
  shipstation_branding_id: "",
  automatically_fulfill_orders: false,
}

export const ShipStationForm: FC<ShipStationFormProps> = ({
  vendor,
  shippingProvider,
}) => {
  const configQuery = useGetShipStationConfig(vendor.id)
  const storesQuery = useGetShipStationStores(vendor.id)
  const updateConfig = useAdminUpdateShipStationConfig(vendor.id)
  const createConfig = useAdminCreateShipStationConfig(vendor.id)
  const notification = useNotification()

  const form = useForm<ShipStationFormValues>()

  const { register, reset, handleSubmit, control } = form

  const dataLoading =
    !vendor || !shippingProvider || !configQuery?.data || !storesQuery?.data

  const config = configQuery.data?.config
  const stores = storesQuery.data?.stores || []

  const storeOptions = stores.map((s) => ({ label: s.name, value: s.id }))

  useEffect(() => {
    if (dataLoading) return

    const shipstation_store_id = storeOptions.find(
      (so) => so.value === config?.shipstation_store_id
    )

    reset({ ...defaultValues, ...config, shipstation_store_id })
  }, [vendor, config, stores, reset])

  if (dataLoading) return <Spinner size="large" variant="secondary" />

  const submitting = createConfig.isLoading || updateConfig.isLoading

  const handleCancel = () => {
    const shipstation_store_id = storeOptions.find(
      (so) => so.value === config?.shipstation_store_id
    )
    reset({ ...defaultValues, ...config, shipstation_store_id })
  }

  const onSubmit = async (data: ShipStationFormValues) => {
    if (!config) {
      return createConfig.mutate(
        {
          api_key: data.api_key,
          api_secret: data.api_secret,
        },
        {
          onSuccess: () => {
            configQuery.refetch()
            storesQuery.refetch()
            notification(
              "Success",
              "ShipStation Integration Configured",
              "success"
            )
          },
          onError: (error) => {
            notification("Faulure", error?.response?.data?.message, "error")
          },
        }
      )
    }

    const update = {
      api_key: data.api_key,
      api_secret: data.api_secret,
      shipstation_branding_id: data.shipstation_branding_id,
      automatically_fulfill_orders: data.automatically_fulfill_orders,
      shipstation_store_id: data.shipstation_store_id?.value,
    }

    return updateConfig.mutate(update, {
      onSuccess: () => {
        configQuery.refetch()
        notification("Success", "ShipStation Integration Updated", "success")
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
            label="API key"
            required
            placeholder="Enter the API key for this shipping provider"
            {...register("api_key", { required: "API key is required" })}
          />
          <Input
            label="API secret"
            required
            placeholder="Enter the API secret for this shipping provider"
            {...register("api_secret", { required: "API secret is required" })}
          />

          {!!config && (
            <>
              <Controller
                name="shipstation_store_id"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Select
                      label="Store"
                      options={storeOptions}
                      value={value}
                      onChange={onChange}
                    />
                  )
                }}
              />

              <Input
                label="Branding ID"
                placeholder="Enter the Branding ID to use for themed tracking pages"
                {...register("shipstation_branding_id")}
              />
              <Checkbox
                label="Automatically Fulfill Orders"
                {...register("automatically_fulfill_orders")}
              />
            </>
          )}
        </div>
      </BodyCard>
    </form>
  )
}
