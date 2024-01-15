import { FocusModal } from "@medusajs/ui"
import { useAdminSalesChannel } from "medusa-react"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { AddProductsToSalesChannelForm } from "./components"

export const SalesChannelAddProducts = () => {
  const { id } = useParams()
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const { sales_channel, isLoading, isError, error } = useAdminSalesChannel(id!)

  const handleSuccess = () => {
    onOpenChange(false, true)
  }

  if (isError) {
    throw error
  }

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        {isLoading || !sales_channel ? (
          <div>Loading...</div>
        ) : (
          <AddProductsToSalesChannelForm
            salesChannel={sales_channel}
            onSuccess={handleSuccess}
            subscribe={subscribe}
          />
        )}
      </FocusModal.Content>
    </FocusModal>
  )
}
