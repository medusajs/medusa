import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { EditSalesChannelsForm } from "./components/edit-sales-channels-form"
import { useProduct } from "../../../hooks/api/products"

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
