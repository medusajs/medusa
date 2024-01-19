import { FocusModal } from "@medusajs/ui"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { CreateCategoryForm } from "./components/create-category-form"

export const CategoryCreate = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()
  const { id } = useParams()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <CreateCategoryForm subscribe={subscribe} parentId={id} />
      </FocusModal.Content>
    </FocusModal>
  )
}
