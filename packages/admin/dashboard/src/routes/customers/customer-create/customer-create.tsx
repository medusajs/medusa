import { RouteFocusModal } from "../../../components/modals"
import { CreateCustomerForm } from "./components/create-customer-form"

export const CustomerCreate = () => {
  return (
    <RouteFocusModal>
      <CreateCustomerForm />
    </RouteFocusModal>
  )
}
