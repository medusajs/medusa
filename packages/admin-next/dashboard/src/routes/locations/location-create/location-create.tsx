import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { CreateLocationForm } from "./components/create-location-form"

export const LocationCreate = () => {
  const [open, onOpenChange] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <CreateLocationForm />
      </FocusModal.Content>
    </FocusModal>
  )
}
