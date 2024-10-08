import { RouteFocusModal } from "../../../components/modals"
import { CreateCustomerGroupForm } from "./components/create-customer-group-form"

export const CustomerGroupCreate = () => {
  return (
    <RouteFocusModal>
      <CreateCustomerGroupForm />
    </RouteFocusModal>
  )
}
