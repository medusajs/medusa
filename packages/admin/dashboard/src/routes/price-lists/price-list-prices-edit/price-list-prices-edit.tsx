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

  const { price_list, isLoading, isError, error } = usePriceList(id!, {
    fields: "*prices,prices.price_set.variant.id,prices.price_rules.attribute,prices.price_rules.value",
  })
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
    // TODO: Remove exclusion once we avoid including unnecessary relations by default in the query config
    fields:
      "title,thumbnail,*variants,-type,-collection,-options,-tags,-images,-sales_channels",
  })

  const { isReady, regions, currencies, pricePreferences } =
    usePriceListCurrencyData()

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
      <RouteFocusModal.Title asChild>
        <span className="sr-only">Edit Prices for {price_list?.title}</span>
      </RouteFocusModal.Title>
      <RouteFocusModal.Description className="sr-only">
        Update prices for products in the price list
      </RouteFocusModal.Description>
      {ready && (
        <PriceListPricesEditForm
          priceList={price_list}
          products={products}
          regions={regions}
          currencies={currencies}
          pricePreferences={pricePreferences}
        />
      )}
    </RouteFocusModal>
  )
}
