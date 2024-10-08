import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { useProduct } from "../../../hooks/api/products"
import { ProductMediaView } from "./components/product-media-view"

export const ProductMedia = () => {
  const { id } = useParams()

  const { product, isLoading, isError, error } = useProduct(id!)

  const ready = !isLoading && product

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && <ProductMediaView product={product} />}
    </RouteFocusModal>
  )
}
