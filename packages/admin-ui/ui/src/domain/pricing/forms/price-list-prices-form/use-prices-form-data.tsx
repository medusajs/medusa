import type { PriceList } from "@medusajs/medusa"
import { useAdminProducts, useAdminRegions, useAdminStore } from "medusa-react"
import * as React from "react"

type UsePricesFormDataProps = {
  priceList?: PriceList
  productIds: string[]
  enable?: {
    products?: boolean
  }
}

const usePricesFormData = ({
  priceList,
  productIds,
  enable = {
    products: true,
  },
}: UsePricesFormDataProps) => {
  const {
    products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useAdminProducts(
    {
      id: productIds,
      price_list_id: priceList ? [priceList.id] : undefined,
    },
    {
      keepPreviousData: true,
      enabled: !!productIds?.length && enable.products,
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

  const isLoading =
    (enable.products && isLoadingProducts) || isLoadingStore || isLoadingRegions
  const isError =
    (enable.products && isErrorProducts) || isStoreError || isErrorRegions
  const isNotFound = (enable.products && !products) || !regions || !currencies

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
