import { FocusModal } from "@medusajs/ui"
import { useAdminCollection } from "medusa-react"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { AddProductsToCollectionForm } from "./components/add-products-to-collection-form"

export const CollectionAddProducts = () => {
  const { id } = useParams()
  const { collection, isLoading, isError, error } = useAdminCollection(id!)

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
        {!isLoading && collection && (
          <AddProductsToCollectionForm
            collection={collection}
            onSuccessfulSubmit={handleSuccessfulSubmit}
            subscribe={subscribe}
          />
        )}
      </FocusModal.Content>
    </FocusModal>
  )
}
