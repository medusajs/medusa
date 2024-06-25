import { CreateReservationForm } from "./components/create-reservation-form"
import { RouteFocusModal } from "../../../../components/route-modal"
import { useSearchParams } from "react-router-dom"

export const CreateReservationModal = () => {
  const [params] = useSearchParams()

  const inventoryItemId = params.get("item_id")

  return (
    <RouteFocusModal>
      <CreateReservationForm inventoryItemId={inventoryItemId} />
    </RouteFocusModal>
  )
}
