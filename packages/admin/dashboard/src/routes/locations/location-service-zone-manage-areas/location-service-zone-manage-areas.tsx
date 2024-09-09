import { json, useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { EditServiceZoneAreasForm } from "./components/edit-region-areas-form"

export const LocationServiceZoneManageAreas = () => {
  const { location_id, fset_id, zone_id } = useParams()

  const { stock_location, isPending, isError, error } = useStockLocation(
    location_id!,
    {
      fields: "*fulfillment_sets.service_zones.geo_zones",
    }
  )

  const zone = stock_location?.fulfillment_sets
    ?.find((f) => f.id === fset_id)
    ?.service_zones.find((z) => z.id === zone_id)

  if (isError) {
    throw error
  }

  if (!isPending && !zone) {
    throw json(
      { message: `Service zone with ID ${zone_id} was not found` },
      404
    )
  }

  return (
    <RouteFocusModal prev={`/settings/locations/${location_id}`}>
      {!isPending && zone && (
        <EditServiceZoneAreasForm
          zone={zone}
          fulfillmentSetId={fset_id!}
          locationId={location_id!}
        />
      )}
    </RouteFocusModal>
  )
}
