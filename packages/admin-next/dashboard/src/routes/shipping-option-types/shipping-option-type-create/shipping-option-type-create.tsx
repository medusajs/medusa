import { CreateShippingOptionTypeForm } from "./components/create-shipping-option-type-form"
import { RouteFocusModal } from "../../../components/modals"

export function ShippingOptionTypeCreate() {
  return (
    <RouteFocusModal>
      <CreateShippingOptionTypeForm />
    </RouteFocusModal>
  )
}
