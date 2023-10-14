import type { PriceList } from "@medusajs/medusa"
import { useAdminProducts, useAdminRegions, useAdminStore } from "medusa-react"
import * as React from "react"

type UsePricesFormDataProps = {
  priceList?: PriceList
  productIds: string[]
}

const usePricesFormData = ({
  priceList,
  productIds,
}: UsePricesFormDataProps) => {
  const {
    products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useAdminProducts(
    {
      id: productIds,
      limit: productIds?.length,
      price_list_id: priceList ? [priceList.id] : undefined,
    },
    {
      keepPreviousData: true,
    }
  )

  const {
    store,
    isLoading: isLoadingStore,
    isError: isStoreError,
  } = useAdminStore()

  const currencies = React.useMemo(() => {
    if (!store) {
      return []
    }

    return store.currencies
  }, [store])

  const {
    regions,
    isLoading: isLoadingRegions,
    isError: isErrorRegions,
  } = useAdminRegions(
    {
      limit: 1000,
    },
    {
      keepPreviousData: true,
    }
  )

  const isLoading = isLoadingProducts || isLoadingStore || isLoadingRegions
  const isError = isErrorProducts || isStoreError || isErrorRegions
  const isNotFound = !products || !regions || !currencies

  return {
    isError,
    isLoading,
    isNotFound,
    products: products ?? [],
    currencies,
    regions: regions ?? [],
  }
}

export { usePricesFormData }
