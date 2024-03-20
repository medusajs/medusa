import { useAdminProduct } from "medusa-react"
import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { ProductImageGallery } from "./components/product-image-gallary/product-image-gallary"

export const ProductImages = () => {
  const { id } = useParams()

  const { product, isLoading, isError, error } = useAdminProduct(id!)

  const ready = !isLoading && product

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && (
        <ProductImageGallery
          images={product.images}
          thumbnail={product.thumbnail}
        />
      )}
    </RouteFocusModal>
  )
}
