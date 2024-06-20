import { RouteFocusModal } from "../../../components/route-modal"
import { CreateShippingOptionTypeForm } from "./components/create-shipping-option-type-form"

export function ShippingOptionTypeCreate() {
  return (
    <RouteFocusModal>
      <CreateShippingOptionTypeForm />
    </RouteFocusModal>
  )
}
