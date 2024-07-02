import { HttpTypes } from "@medusajs/types"
import { useRegions } from "../../../../hooks/api/regions"
import { useStore } from "../../../../hooks/api/store"

type UsePriceListCurrencyDataReturn =
  | { isReady: false; currencies: undefined; regions: undefined }
  | {
      isReady: true
      currencies: HttpTypes.AdminStoreCurrency[]
      regions: HttpTypes.AdminRegion[]
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

  const isReady =
    !!currencies && !!regions && !isStorePending && !isRegionsPending

  if (isRegionsError) {
    throw regionsError
  }

  if (isStoreError) {
    throw storeError
  }

  if (!isReady) {
    return { regions: undefined, currencies: undefined, isReady: false }
  }

  return { regions, currencies, isReady }
}
