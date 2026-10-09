import { useParams } from "react-router-dom"
import { PricingEdit } from "./components/prices-edit"
import { RouteFocusModal } from "@medusajs/dashboard/components"
import { useProduct } from "@medusajs/dashboard/hooks"

export const ProductPrices = () => {
  const { id, variant_id } = useParams()

  const { product, isLoading, isError, error } = useProduct(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && product && (
        <PricingEdit product={product} variantId={variant_id} />
      )}
    </RouteFocusModal>
  )
}

export default ProductPrices
