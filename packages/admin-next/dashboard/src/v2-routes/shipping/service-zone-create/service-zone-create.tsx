import { useLoaderData, useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { CreateServiceZoneForm } from "./components/create-service-zone-form"
import { stockLocationLoader } from "./loader"

export function ServiceZoneCreate() {
  const { fset_id, location_id } = useParams()
  const { stock_location: stockLocation } = useLoaderData() as Awaited<
    ReturnType<typeof stockLocationLoader>
  >

  const fulfillmentSet = stockLocation.fulfillment_sets.find(
    (f) => f.id === fset_id
  )

  if (!fulfillmentSet) {
    throw new Error("Fulfillment set doesn't exist")
  }

  return (
    <RouteFocusModal>
      <CreateServiceZoneForm
        locationId={location_id!}
        fulfillmentSet={fulfillmentSet}
      />
    </RouteFocusModal>
  )
}
