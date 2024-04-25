import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { LocationEditSalesChannelsForm } from "./components/edit-sales-channels-form"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { useSalesChannels } from "../../../hooks/api/sales-channels.tsx"

export const LocationAddSalesChannels = () => {
  const { location_id } = useParams()
  const {
    stock_location,
    isPending: isLocationLoading,
    isError,
    error,
  } = useStockLocation(location_id!, {
    fields: "*sales_channels",
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
