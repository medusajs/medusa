import { useAdminRegions, useAdminStore } from "medusa-react"
import { useSearchParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { EditProductPricesForm } from "./components/edit-product-prices-form"

export const PricingProductsEdit = () => {
  const [searchParams] = useSearchParams()

  const { regions, isLoading, isError, error } = useAdminRegions({
    limit: 1000,
    fields: "id,name,includes_tax,currency.code,currency.symbol_native",
    expand: "currency",
  })

  const {
    store,
    isLoading: isLoadingStore,
    isError: isStoreError,
    error: storeError,
  } = useAdminStore()

  const ids = searchParams.get("ids[]")
  const currencies = store?.currencies || []
  const ready = !isLoading && regions && !isLoadingStore && store

  if (isError) {
    throw error
  }

  if (isStoreError) {
    throw storeError
  }

  return (
    <RouteFocusModal>
      {ready && (
        <EditProductPricesForm
          ids={ids}
          regions={regions}
          currencies={currencies}
        />
      )}
    </RouteFocusModal>
  )
}
