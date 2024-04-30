import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { LocationEditSalesChannelsForm } from "./components/edit-sales-channels-form"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { useSalesChannels } from "../../../hooks/api/sales-channels"

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

  const { sales_channels, isPending: isChannelsLoading } = useSalesChannels({
    location_id: location_id,
    limit: 9999,
  })

  if (isError) {
    throw error
  }

  const isLoading = isLocationLoading || isChannelsLoading

  /**
   * HACK - for now until endpoint is fixed
   */
  stock_location.sales_channels = sales_channels

  return (
    <RouteFocusModal>
      {!isLoading && stock_location && (
        <LocationEditSalesChannelsForm location={stock_location} />
      )}
    </RouteFocusModal>
  )
}
