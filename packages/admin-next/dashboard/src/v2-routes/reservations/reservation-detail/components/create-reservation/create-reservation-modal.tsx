import { CreateCustomerGroupForm } from "./components/create-reservation-form"
import { RouteFocusModal } from "../../../../../components/route-modal"

export const CreateReservationForm = () => {
  return (
    <RouteFocusModal>
      <CreateCustomerGroupForm />
    </RouteFocusModal>
  )
}
