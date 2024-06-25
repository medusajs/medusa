import { useParams } from "react-router-dom"

import { useProduct } from "../../../hooks/api/products"
import { RouteFocusModal } from "../../../components/route-modal"
import { PricingEdit } from "./pricing-edit"

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
