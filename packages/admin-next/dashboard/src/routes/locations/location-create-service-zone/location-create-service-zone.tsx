import { json, useLoaderData, useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { CreateServiceZoneForm } from "./components/create-service-zone-form"
import { stockLocationLoader } from "./loader"

export function LocationCreateServiceZone() {
  const { fset_id, location_id } = useParams()
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof stockLocationLoader>
  >

  const { stock_location, isPending, isError, error } = useStockLocation(
    location_id!,
    undefined,
    {
      initialData,
    }
  )

  const fulfillmentSet = stock_location?.fulfillment_sets.find(
    (f) => f.id === fset_id
  )

  const ready = !isPending && !!fulfillmentSet

  if (!fulfillmentSet) {
    throw json(
      { message: `Fulfillment set with ID: ${fset_id} was not found.` },
      404
    )
  }

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && (
        <CreateServiceZoneForm
          fulfillmentSet={fulfillmentSet}
          locationId={location_id!}
        />
      )}
    </RouteFocusModal>
  )
}
