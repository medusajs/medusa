import { Vendor } from "@medusajs/medusa"
import { FC, useEffect } from "react"
import { useForm } from "react-hook-form"
import Checkbox from "../../../../../../components/atoms/checkbox"
import Spinner from "../../../../../../components/atoms/spinner"
import LogoProps from "../../../../../../components/fundamentals/logos/types/logo-type"
import Input from "../../../../../../components/molecules/input"
import BodyCard from "../../../../../../components/organisms/body-card"
import {
  useAdminCreateShippoConfig,
  useAdminUpdateShippoConfig,
  useGetShippoConfig,
} from "../../../../../../hooks/admin/shippo"
import useNotification from "../../../../../../hooks/use-notification"

export interface ShippoFormProps {
  vendor: Vendor
  shippingProvider: { name: string; logo: FC<LogoProps> }
}

interface ShippoFormValues {
  api_key: string
  automatically_fulfill_orders: boolean
}

const defaultValues = {
  api_key: "",
  automatically_fulfill_orders: false,
}

export const ShippoForm: FC<ShippoFormProps> = ({
  vendor,
  shippingProvider,
}) => {
  const configQuery = useGetShippoConfig(vendor.id)
  const updateConfig = useAdminUpdateShippoConfig(vendor.id)
  const createConfig = useAdminCreateShippoConfig(vendor.id)
  const notification = useNotification()

  const form = useForm<ShippoFormValues>()

  const { register, reset, handleSubmit } = form

  const dataLoading = !vendor || !shippingProvider || !configQuery?.data

  const config = configQuery.data?.config

  useEffect(() => {
    if (dataLoading) return

    reset({ ...defaultValues, ...config })
  }, [vendor, config, reset])

  const handleCancel = () => {
    reset({ ...defaultValues, ...config })
  }

  if (dataLoading) return <Spinner size="large" variant="secondary" />

  const submitting = createConfig.isLoading || updateConfig.isLoading

  const onSubmit = async (data: ShippoFormValues) => {
    if (!config) {
      return createConfig.mutate(
        {
          api_key: data.api_key,
        },
        {
          onSuccess: () => {
            configQuery.refetch()
            notification("Success", "Shippo Integration Configured", "success")
          },
          onError: (error) => {
            notification("Faulure", error?.response?.data?.message, "error")
          },
        }
      )
    }

    const update = {
      api_key: data.api_key,
      automatically_fulfill_orders: data.automatically_fulfill_orders,
    }

    return updateConfig.mutate(update, {
      onSuccess: () => {
        configQuery.refetch()
        notification("Success", "Shippo Integration Updated", "success")
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
        title={<shippingProvider.logo width="auto" />}
        subtitle={`Configure the ${shippingProvider.name} integration.`}
      >
        <h6 className="inter-base-semibold mt-0 mb-base">How it works</h6>
        <p className="mb-base">
          Connecting your orders to your Shippo account is easy with our Shippo
          integration. After you fulfill an order, it will appear in your Shippo
          dashboard where you can create shipping labels and ship products to
          your customers.
        </p>
        <p className="mb-base">
          To get started, you'll need to create an API key. Simply click on{" "}
          <a
            className="font-bold underline text-blue-400"
            target="_blank"
            href="https://apps.goshippo.com/settings/api"
          >
            this link{" "}
          </a>{" "}
          to generate your token and copy it. Then, paste the token in the API
          key field below to connect with Shippo.
        </p>
        <h6 className="inter-base-semibold mt-0 mb-base">General</h6>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4">
          <Input
            label="API key"
            required
            placeholder="Enter the API key for this shipping provider"
            {...register("api_key", { required: "API key is required" })}
          />

          {!!config && (
            <>
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
