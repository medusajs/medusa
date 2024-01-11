import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { NewSalesChannelForm } from "./components/new-sales-channel-form"

export const SalesChannelCreate = () => {
  const [open, onOpenChange] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <NewSalesChannelForm />
      </FocusModal.Content>
    </FocusModal>
  )
}
