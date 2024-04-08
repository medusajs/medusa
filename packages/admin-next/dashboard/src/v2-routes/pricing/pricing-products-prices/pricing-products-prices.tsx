import { useParams, useSearchParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { usePriceList } from "../../../hooks/api/price-lists"
import { useProducts } from "../../../hooks/api/products"
import { PricingProductPricesForm } from "./components/pricing-products-prices-form"

export const PricingProductsPrices = () => {
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
    fields: "title,thumbnail,*variants",
  })

  const ready = !isLoading && !!price_list && !isProductsLoading && !!products

  if (isError) {
    throw error
  }

  if (isProductsError) {
    throw productError
  }

  return (
    <RouteFocusModal>
      {ready && (
        <PricingProductPricesForm priceList={price_list} products={products} />
      )}
    </RouteFocusModal>
  )
}
