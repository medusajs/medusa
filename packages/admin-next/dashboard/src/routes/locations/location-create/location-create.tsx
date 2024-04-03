import { CreateLocationForm } from "../../../modules/locations/location-create/components/create-location-form"
import { RouteFocusModal } from "../../../components/route-modal"

export const LocationCreate = () => {
  return (
    <RouteFocusModal>
      <CreateLocationForm />
    </RouteFocusModal>
  )
}
