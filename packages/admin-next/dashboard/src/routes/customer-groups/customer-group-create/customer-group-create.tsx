import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"

export const CustomerGroupCreate = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content></FocusModal.Content>
    </FocusModal>
  )
}
