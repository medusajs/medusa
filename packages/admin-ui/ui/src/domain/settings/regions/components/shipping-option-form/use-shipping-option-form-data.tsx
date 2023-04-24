import { useAdminRegionFulfillmentOptions } from "medusa-react"
import { useMemo } from "react"
import { ShippingOptionFormType } from "."
import {
  useGetFulfillmentOptions,
  useGetStoreFulfillmentOptions,
  useGetVendorFulfillmentOptions,
} from "../../../../../hooks/admin/fulfillment-providers"
import { useAdminShippingProfiles } from "../../../../../hooks/admin/shipping-profiles/queries"
import { Option } from "../../../../../types/shared"
import fulfillmentProvidersMapper from "../../../../../utils/fulfillment-providers.mapper"

type OptionType = {
  id: string
  name?: string
  is_return?: boolean
}

export const getRequirementsData = (data: ShippingOptionFormType) => {
  const requirements = Object.entries(data.requirements).reduce(
    (acc, [key, value]) => {
      if (value?.amount && value.amount > 0) {
        acc.push({
          type: key,
          amount: value.amount,
          id: value.id || undefined,
        })
        return acc
      } else {
        return acc
      }
    },
    [] as { type: string; amount: number; id?: string }[]
  )

  return requirements
}

export const useShippingOptionFormData = ({
  regionId,
  vendorId,
  isReturn = false,
}: {
  regionId: string
  isReturn?: boolean
  vendorId?: string
}) => {
  const { shipping_profiles } = useAdminShippingProfiles({
    vendor_id: vendorId ?? "null",
    type: vendorId ? "vendor_default" : "default",
  })

  const { fulfillment_options } = useGetFulfillmentOptions({ regionId })

  const fulfillmentOptions: (Option & {
    provider_id: string
  })[] = useMemo(() => {
    if (!fulfillment_options) {
      return []
    }

    const options = fulfillment_options.reduce((acc, current, index) => {
      const opts = current.options as OptionType[]

      const filtered = opts.filter((o) => !!o.is_return === !!isReturn)

      return acc.concat(
        filtered.map((option, o) => ({
          label: `${option.name || option.id}`,
          value: `${index}.${o}`,
          provider_id: current.provider_id,
        }))
      )
    }, [] as (Option & { provider_id: string })[])

    return options
  }, [fulfillment_options])

  const fulfillmentProviderOptions = useMemo(() => {
    if (!fulfillment_options) {
      return []
    }

    const providerIds = [
      ...new Set(fulfillment_options.map((o) => o.provider_id)),
    ]

    return providerIds.map(fulfillmentProvidersMapper)
  }, [fulfillment_options])

  const shippingProfileOptions = useMemo(() => {
    return (
      shipping_profiles?.map((profile) => ({
        value: profile.id,
        label: profile.name,
      })) || []
    )
  }, [shipping_profiles])

  const getFulfillmentData = (value: string) => {
    const fOptions = fulfillment_options?.map((provider) => {
      const options = provider.options as OptionType[]

      const filtered = options.filter(
        (o) => o.is_return === undefined || !!o.is_return === !!isReturn
      )

      return {
        ...provider,
        options: filtered,
      }
    })

    const [providerIndex, optionIndex] = value.split(".")
    const { provider_id, options } = fOptions?.[providerIndex] || {}

    return { provider_id, data: options?.[optionIndex] || {} } as {
      provider_id: string
      data: Record<string, unknown>
    }
  }

  return {
    shippingProfileOptions,
    fulfillmentOptions,
    getFulfillmentData,
    fulfillmentProviderOptions,
  }
}
