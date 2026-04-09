import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useProduct } from "../../../hooks/api/products"
import { EditSalesChannelsForm } from "./components/edit-sales-channels-form"

export const ProductSalesChannels = () => {
  const { id } = useParams()
  const { product, isLoading, isError, error } = useProduct(id!, {
    // TODO: Remove exclusion once we avoid including unnecessary relations by default in the query config
    fields: "-type,-collection,-options,-tags,-images,-variants",
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && product && <EditSalesChannelsForm product={product} />}
    </RouteFocusModal>
  )
}
