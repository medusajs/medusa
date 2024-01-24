import { FocusModal } from "@medusajs/ui"
import { useAdminPublishableApiKeySalesChannels } from "medusa-react"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { AddSalesChannelsToApiKeyForm } from "./components"

export const ApiKeyManagementAddSalesChannels = () => {
  const { id } = useParams()
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const { sales_channels, isLoading, isError, error } =
    useAdminPublishableApiKeySalesChannels(id!)

  const handleSuccessfulSubmit = () => {
    onOpenChange(false, true)
  }

  if (isError) {
    throw error
  }

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        {!isLoading && sales_channels && (
          <AddSalesChannelsToApiKeyForm
            apiKey={id!}
            preSelected={sales_channels.map((sc) => sc.id)}
            onSuccessfulSubmit={handleSuccessfulSubmit}
            subscribe={subscribe}
          />
        )}
      </FocusModal.Content>
    </FocusModal>
  )
}
