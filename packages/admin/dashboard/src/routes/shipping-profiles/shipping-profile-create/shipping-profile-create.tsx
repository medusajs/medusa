
import { RouteFocusModal } from "../../../components/modals"
import { CreateShippingProfileForm } from "./components/create-shipping-profile-form"

export function ShippingProfileCreate() {
  return (
    <RouteFocusModal>
      <CreateShippingProfileForm />
    </RouteFocusModal>
  )
}
