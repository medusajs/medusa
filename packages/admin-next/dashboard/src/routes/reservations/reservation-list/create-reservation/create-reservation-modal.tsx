import { useSearchParams } from "react-router-dom"
import { RouteFocusModal } from "../../../../components/modals"
import { CreateReservationForm } from "./components/create-reservation-form"

export const CreateReservationModal = () => {
  const [params] = useSearchParams()

  const inventoryItemId = params.get("item_id")

  return (
    <RouteFocusModal>
      <CreateReservationForm inventoryItemId={inventoryItemId} />
    </RouteFocusModal>
  )
}
