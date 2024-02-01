import { FocusModal } from "@medusajs/ui"
import { useAdminAddLocationToSalesChannel } from "medusa-react"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"

export const LocationAddSalesChannels = () => {
  const [open, onOpenChange] = useRouteModalState()

  const { mutateAsync } = useAdminAddLocationToSalesChannel() // TODO: We need a batch mutation instead of this to avoid multiple requests

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content></FocusModal.Content>
    </FocusModal>
  )
}
