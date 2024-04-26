import { CreateReservationForm } from "./components/create-reservation-form"
import { RouteFocusModal } from "../../../../components/route-modal"

export const CreateReservationModal = () => {
  return (
    <RouteFocusModal>
      <CreateReservationForm />
    </RouteFocusModal>
  )
}
