import { HttpTypes } from "@medusajs/types"
import { useRegions } from "../../../../hooks/api/regions"
import { useStore } from "../../../../hooks/api/store"
import { usePricePreferences } from "../../../../hooks/api/price-preferences"

type UsePriceListCurrencyDataReturn =
  | {
      isReady: false
      currencies: undefined
      regions: undefined
      pricePreferences: undefined
    }
  | {
      isReady: true
      currencies: HttpTypes.AdminStoreCurrency[]
      regions: HttpTypes.AdminRegion[]
      pricePreferences: HttpTypes.AdminPricePreference[]
    }

export const usePriceListCurrencyData = (): UsePriceListCurrencyDataReturn => {
  const {
    store,
    isPending: isStorePending,
    isError: isStoreError,
    error: storeError,
  } = useStore({
    fields: "+supported_currencies",
  })

  const currencies = store?.supported_currencies

  const {
    regions,
    isPending: isRegionsPending,
    isError: isRegionsError,
    error: regionsError,
  } = useRegions({
    fields: "id,name,currency_code",
    limit: 999,
  })

  const {
    price_preferences: pricePreferences,
    isPending: isPreferencesPending,
    isError: isPreferencesError,
    error: preferencesError,
  } = usePricePreferences({})

  const isReady =
    !!currencies &&
    !!regions &&
    !!pricePreferences &&
    !isStorePending &&
    !isRegionsPending &&
    !isPreferencesPending

  if (isRegionsError) {
    throw regionsError
  }

  if (isStoreError) {
    throw storeError
  }

  if (isPreferencesError) {
    throw preferencesError
  }

  if (!isReady) {
    return {
      regions: undefined,
      currencies: undefined,
      pricePreferences: undefined,
      isReady: false,
    }
  }

  return { regions, currencies, pricePreferences, isReady }
}
