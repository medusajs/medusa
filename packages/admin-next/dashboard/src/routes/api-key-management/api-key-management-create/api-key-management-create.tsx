import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { CreatePublishableApiKeyForm } from "./components/create-publishable-api-key-form"

export const ApiKeyManagementCreate = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <CreatePublishableApiKeyForm subscribe={subscribe} />
      </FocusModal.Content>
    </FocusModal>
  )
}
