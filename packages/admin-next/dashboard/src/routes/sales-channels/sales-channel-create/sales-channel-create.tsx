import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { CreateSalesChannelForm } from "./components/create-sales-channel-form"

export const SalesChannelCreate = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <CreateSalesChannelForm subscribe={subscribe} />
      </FocusModal.Content>
    </FocusModal>
  )
}
