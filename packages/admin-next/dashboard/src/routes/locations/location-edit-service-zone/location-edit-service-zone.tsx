import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { json, useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { EditServiceZoneForm } from "./components/edit-region-form"

export const LocationEditServiceZone = () => {
  const { t } = useTranslation()
  const { location_id, fset_id, zone_id } = useParams()

  const { stock_location, isPending, isError, error } = useStockLocation(
    location_id!,
    {
      fields:
        "name,address.city,address.country_code,fulfillment_sets.type,fulfillment_sets.name,*fulfillment_sets.service_zones.geo_zones,*fulfillment_sets.service_zones,*fulfillment_sets.service_zones.shipping_options,*fulfillment_sets.service_zones.shipping_options.shipping_profile",
    }
  )

  const zone = stock_location?.fulfillment_sets
    .find((f) => f.id === fset_id)
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
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("location.serviceZone.edit.title")}</Heading>
      </RouteDrawer.Header>
      {!isPending && zone && (
        <EditServiceZoneForm
          zone={zone}
          fulfillmentSetId={fset_id}
          locationId={location_id}
        />
      )}
    </RouteDrawer>
  )
}
