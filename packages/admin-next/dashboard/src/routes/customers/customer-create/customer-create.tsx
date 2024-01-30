import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { CreateCustomerForm } from "./components/create-customer-form"

export const CustomerCreate = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <CreateCustomerForm subscribe={subscribe} />
      </FocusModal.Content>
    </FocusModal>
  )
}
