import { RouteFocusModal } from "../../../components/modals"
import { CreateLocationForm } from "./components/create-location-form"

export const LocationCreate = () => {
  return (
    <RouteFocusModal>
      <CreateLocationForm />
    </RouteFocusModal>
  )
}
