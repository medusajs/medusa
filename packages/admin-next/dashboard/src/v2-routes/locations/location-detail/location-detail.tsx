import { Outlet, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { LocationGeneralSection } from "./components/location-general-section"
import { LocationSalesChannelSection } from "./components/location-sales-channel-section"

export const LocationDetail = () => {
  const { id } = useParams()
  const {
    stock_location,
    isPending: isLoading,
    isError,
    error,
  } = useStockLocation(id!, {
    fields: "*address,*sales_channels",
  })

  if (isLoading || !stock_location) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
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
