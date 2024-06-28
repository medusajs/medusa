import { json, useLoaderData, useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { FulfillmentSetType } from "../common/constants"
import { CreateServiceZoneForm } from "./components/create-service-zone-form"
import { stockLocationLoader } from "./loader"

export function LocationCreateServiceZone() {
  const { fset_id, location_id } = useParams()
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof stockLocationLoader>
  >

  const { stock_location, isLoading, isError, error } = useStockLocation(
    location_id!,
    {
      fields: "*fulfillment_sets",
    },
    {
      initialData,
    }
  )

  const fulfillmentSet = stock_location?.fulfillment_sets?.find(
    (f) => f.id === fset_id
  )

  const ready = !isLoading && !!stock_location && !!fulfillmentSet

  const type: FulfillmentSetType =
    fulfillmentSet?.type === FulfillmentSetType.Pickup
      ? FulfillmentSetType.Pickup
      : FulfillmentSetType.Shipping

  if (!isLoading && !fulfillmentSet) {
    throw json(
      { message: `Fulfillment set with ID: ${fset_id} was not found.` },
      404
    )
  }

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal prev={`/settings/locations/${location_id}`}>
      {ready && (
        <CreateServiceZoneForm
          fulfillmentSet={fulfillmentSet}
          type={type}
          location={stock_location}
        />
      )}
    </RouteFocusModal>
  )
}
