import { FocusModal } from "@medusajs/ui"
import { useAdminProductCategory } from "medusa-react"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { AddProductsToCategoryForm } from "./components/add-products-to-category-form"

export const CategoryAddProducts = () => {
  const { id } = useParams()
  const { product_category, isLoading, isError, error } =
    useAdminProductCategory(id!)
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const handleSuccessfulSubmit = () => {
    onOpenChange(false, true)
  }

  if (isError) {
    throw error
  }

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        {!isLoading && product_category && (
          <AddProductsToCategoryForm
            category={product_category}
            onSuccessfulSubmit={handleSuccessfulSubmit}
            subscribe={subscribe}
          />
        )}
      </FocusModal.Content>
    </FocusModal>
  )
}
