import { RouteFocusModal } from "../../../components/route-modal"
import { CreateCustomerForm } from "./components/create-customer-form"

export const CustomerCreate = () => {
  return (
    <RouteFocusModal>
      <CreateCustomerForm />
    </RouteFocusModal>
  )
}
