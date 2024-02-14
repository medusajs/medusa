import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { CreateGiftCardForm } from "./components/create-gift-card-form"

export const GiftCardCreate = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <CreateGiftCardForm subscribe={subscribe} />
      </FocusModal.Content>
    </FocusModal>
  )
}
