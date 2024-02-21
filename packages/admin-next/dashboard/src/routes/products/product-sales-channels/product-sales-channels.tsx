import { FocusModal } from "@medusajs/ui"
import { useAdminProduct } from "medusa-react"
import { useParams } from "react-router-dom"

import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { EditSalesChannelsForm } from "./components/edit-sales-channels-form"

export const ProductSalesChannels = () => {
  const { id } = useParams()
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const { product, isLoading, isError, error } = useAdminProduct(id!)

  const handleSuccessfulSubmit = () => {
    onOpenChange(false, true)
  }

  if (isError) {
    throw error
  }

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        {!isLoading && product && (
          <EditSalesChannelsForm
            product={product}
            onSuccessfulSubmit={handleSuccessfulSubmit}
            subscribe={subscribe}
          />
        )}
      </FocusModal.Content>
    </FocusModal>
  )
}
