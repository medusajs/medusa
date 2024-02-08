import { FocusModal } from "@medusajs/ui"
import { useAdminProduct } from "medusa-react"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"

export const ProductMedia = () => {
  const { id } = useParams()
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const { product, isLoading, isError, error } = useAdminProduct(id!)

  if (isError) {
    throw error
  }

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        {!isLoading && product ? (
          <div>
            <FocusModal.Header></FocusModal.Header>
            <FocusModal.Body></FocusModal.Body>
          </div>
        ) : null}
      </FocusModal.Content>
    </FocusModal>
  )
}
