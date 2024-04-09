import { RouteFocusModal } from "../../../components/route-modal"
import { CreateCustomerGroupForm } from "./components/create-customer-group-form"

export const CustomerGroupCreate = () => {
  return (
    <RouteFocusModal>
      <CreateCustomerGroupForm />
    </RouteFocusModal>
  )
}
