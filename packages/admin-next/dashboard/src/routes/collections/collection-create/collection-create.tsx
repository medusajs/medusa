import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { CreateCollectionForm } from "./components/create-collection-form"

export const CollectionCreate = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <CreateCollectionForm subscribe={subscribe} />
      </FocusModal.Content>
    </FocusModal>
  )
}
