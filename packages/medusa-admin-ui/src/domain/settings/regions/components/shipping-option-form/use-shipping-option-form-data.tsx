import {
  useAdminRegionFulfillmentOptions,
  useAdminShippingProfiles,
} from "medusa-react"
import { useMemo } from "react"
import { ShippingOptionFormType } from "."
import { Option } from "../../../../../types/shared"
import fulfillmentProvidersMapper from "../../../../../utils/fulfillment-providers.mapper"

type OptionType = {
  id: string
  name?: string
  is_return?: boolean
}

export const useShippingOptionFormData = (
  regionId: string,
  isReturn = false
) => {
  const { shipping_profiles } = useAdminShippingProfiles()
  const { fulfillment_options } = useAdminRegionFulfillmentOptions(regionId)

  const fulfillmentOptions: Option[] = useMemo(() => {
    if (!fulfillment_options) {
      return []
    }

    const options = fulfillment_options.reduce((acc, current, index) => {
      const opts = current.options as OptionType[]

      const filtered = opts.filter((o) => !!o.is_return === !!isReturn)

      return acc.concat(
        filtered.map((option, o) => ({
          label: `${option.name || option.id} via ${
            fulfillmentProvidersMapper(current.provider_id).label
          }`,
          value: `${index}.${o}`,
        }))
      )
    }, [] as Option[])

    return options
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

      const filtered = options.filter((o) => !!o.is_return === !!isReturn)

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

  const getRequirementsData = (data: ShippingOptionFormType) => {
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

  return {
    shippingProfileOptions,
    fulfillmentOptions,
    getFulfillmentData,
    getRequirementsData,
  }
}
