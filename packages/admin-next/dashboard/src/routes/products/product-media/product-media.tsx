import { useAdminProduct } from "medusa-react"
import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { ProductMediaView } from "./components/product-media-view"

export const ProductMedia = () => {
  const { id } = useParams()

  const { product, isLoading, isError, error } = useAdminProduct(id!)

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
