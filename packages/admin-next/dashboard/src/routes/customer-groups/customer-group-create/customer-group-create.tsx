import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { CreateCustomerGroupForm } from "./components/create-customer-group-form"

export const CustomerGroupCreate = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <CreateCustomerGroupForm subscribe={subscribe} />
      </FocusModal.Content>
    </FocusModal>
  )
}
