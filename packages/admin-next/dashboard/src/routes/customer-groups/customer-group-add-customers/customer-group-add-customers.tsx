import { FocusModal } from "@medusajs/ui"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { AddCustomersForm } from "./components/add-customers-form"

export const CustomerGroupAddCustomers = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const { id } = useParams()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <AddCustomersForm customerGroupId={id!} subscribe={subscribe} />
      </FocusModal.Content>
    </FocusModal>
  )
}
