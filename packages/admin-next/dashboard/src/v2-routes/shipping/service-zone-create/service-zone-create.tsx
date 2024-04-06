import { useLoaderData } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { CreateServiceZoneForm } from "./components/create-service-zone-form"
import { stockLocationLoader } from "./loader"

export function ServiceZoneCreate() {
  const { stock_location: stockLocation } = useLoaderData() as Awaited<
    ReturnType<typeof stockLocationLoader>
  >

  return (
    <RouteFocusModal>
      <CreateServiceZoneForm
        fulfillmetnSet={stockLocation.fulfillment_sets[0]}
      />
    </RouteFocusModal>
  )
}
