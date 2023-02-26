import { FulfillmentProvider, PaymentProvider, Store } from "@medusajs/medusa"
import { useAdminStore } from "medusa-react"
import { useMemo } from "react"
import { countries } from "../../../../../utils/countries"
import fulfillmentProvidersMapper from "../../../../../utils/fulfillment-providers.mapper"
import paymentProvidersMapper from "../../../../../utils/payment-providers-mapper"

export const useStoreData = () => {
  const { store, isLoading } = useAdminStore()

  const { fulfillment_providers, payment_providers } = store as Store & {
    fulfillment_providers: FulfillmentProvider[]
    payment_providers: PaymentProvider[]
  }

  const paymentProviderOptions = useMemo(() => {
    if (isLoading) {
      return []
    }

    return payment_providers?.map((p) => paymentProvidersMapper(p.id)) || []
  }, [payment_providers, isLoading])

  const fulfillmentProviderOptions = useMemo(() => {
    if (isLoading) {
      return []
    }

    return (
      fulfillment_providers?.map((p) => fulfillmentProvidersMapper(p.id)) || []
    )
  }, [fulfillment_providers, isLoading])

  const currencyOptions = useMemo(() => {
    if (isLoading) {
      return []
    }

    return (
      store?.currencies.map((c) => ({
        label: c.name,
        value: c.code,
      })) || []
    )
  }, [store, isLoading])

  const countryOptions = countries.map((c) => ({
    label: c.name,
    value: c.alpha2.toLowerCase(),
  }))

  return {
    paymentProviderOptions,
    fulfillmentProviderOptions,
    currencyOptions,
    countryOptions,
  }
}
