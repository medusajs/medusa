import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { LocationEditSalesChannelsForm } from "./components/edit-sales-channels-form"
import { useStockLocation } from "../../../hooks/api/stock-locations"

export const LocationAddSalesChannels = () => {
  const { location_id } = useParams()
  const {
    stock_location = {},
    isPending: isLocationLoading,
    isError,
    error,
  } = useStockLocation(location_id!, {
    fields:
      "name,*sales_channels,address.city,address.country_code,fulfillment_sets.type,fulfillment_sets.name,*fulfillment_sets.service_zones.geo_zones,*fulfillment_sets.service_zones,*fulfillment_sets.service_zones.shipping_options,*fulfillment_sets.service_zones.shipping_options.shipping_profile",
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLocationLoading && stock_location && (
        <LocationEditSalesChannelsForm location={stock_location} />
      )}
    </RouteFocusModal>
  )
}
