import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { CreateCategoryForm } from "./components/create-category-form"

export const CategoryCreate = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <CreateCategoryForm subscribe={subscribe} />
      </FocusModal.Content>
    </FocusModal>
  )
}
