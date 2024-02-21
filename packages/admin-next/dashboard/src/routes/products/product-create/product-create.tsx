import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { CreateProductForm } from "./components/create-product-form"

export const ProductCreate = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <CreateProductForm subscribe={subscribe} />
      </FocusModal.Content>
    </FocusModal>
  )
}
