import { Outlet, json, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { LocationGeneralSection } from "../../../modules/locations/location-detail/components/location-general-section"
import { LocationSalesChannelSection } from "../../../modules/locations/location-detail/components/location-sales-channel-section"
import { useAdminStockLocations } from "medusa-react"

export const LocationDetail = () => {
  const { id } = useParams()
  const { stock_locations, isLoading, isError, error } = useAdminStockLocations(
    {
      id,
      expand: "address,sales_channels",
    }
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  const stock_location = stock_locations?.[0]

  if (!stock_location) {
    throw json({ message: "Not found" }, 404)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <LocationGeneralSection location={stock_location} />
      <LocationSalesChannelSection location={stock_location} />
      <JsonViewSection data={stock_location} />
      <Outlet />
    </div>
  )
}
