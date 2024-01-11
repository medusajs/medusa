import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"

export const ApiKeyManagementCreate = () => {
  const [open, onOpenChange] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content></FocusModal.Content>
    </FocusModal>
  )
}
