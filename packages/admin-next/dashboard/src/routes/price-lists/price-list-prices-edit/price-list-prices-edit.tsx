import { useParams, useSearchParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { usePriceList } from "../../../hooks/api/price-lists"
import { useProducts } from "../../../hooks/api/products"
import { usePriceListCurrencyData } from "../common/hooks/use-price-list-currency-data"
import { PriceListPricesEditForm } from "./components/price-list-prices-edit-form"

export const PriceListPricesEdit = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const ids = searchParams.get("ids[]")

  const { price_list, isLoading, isError, error } = usePriceList(id!)
  const productIds = ids?.split(",")

  const {
    products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productError,
  } = useProducts({
    id: productIds,
    limit: productIds?.length || 9999, // Temporary until we support lazy loading in the DataGrid
    price_list_id: [id!],
    fields: "title,thumbnail,*variants",
  })

  const { isReady, regions, currencies } = usePriceListCurrencyData()

  const ready =
    !isLoading && !!price_list && !isProductsLoading && !!products && isReady

  if (isError) {
    throw error
  }

  if (isProductsError) {
    throw productError
  }

  return (
    <RouteFocusModal>
      {ready && (
        <PriceListPricesEditForm
          priceList={price_list}
          products={products}
          regions={regions}
          currencies={currencies}
        />
      )}
    </RouteFocusModal>
  )
}
