import { useParams } from "react-router-dom"
import { EditSalesChannelsForm } from "./components/edit-sales-channel-form"
import { RouteFocusModal } from "@medusajs/dashboard/components"
import { useProduct } from "@medusajs/dashboard/hooks"

export const ProductSalesChannels = () => {
  const { id } = useParams()
  const { product, isLoading, isError, error } = useProduct(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && product && <EditSalesChannelsForm product={product} />}
    </RouteFocusModal>
  )
}

export default ProductSalesChannels
