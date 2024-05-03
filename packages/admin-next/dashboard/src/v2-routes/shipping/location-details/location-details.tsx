import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { LocationGeneralSection } from "./components/location-general-section"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import LocationsSalesChannelsSection from "./components/location-sales-channels-section/locations-sales-channels-section"
import { locationLoader } from "./loader"

export const LocationDetails = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof locationLoader>
  >

  const { location_id } = useParams()
  const {
    stock_location: location,
    isPending: isLoading,
    isError,
    error,
  } = useStockLocation(
    location_id!,
    {
      fields:
        "name,*sales_channels,address.city,address.country_code,fulfillment_sets.type,fulfillment_sets.name,*fulfillment_sets.service_zones.geo_zones,*fulfillment_sets.service_zones,*fulfillment_sets.service_zones.shipping_options,*fulfillment_sets.service_zones.shipping_options.rules,*fulfillment_sets.service_zones.shipping_options.shipping_profile",
    },
    {
      initialData,
    }
  )

  // TODO: Move to loading.tsx and set as Suspense fallback for the route
  if (isLoading || !location) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-x-4 xl:flex-row xl:items-start">
      <div className="flex w-full flex-col gap-y-2">
        <LocationGeneralSection location={location} />
        <div className="flex w-full flex-col gap-y-2 xl:hidden">
          <LocationsSalesChannelsSection location={location} />
        </div>
        <JsonViewSection data={location} />
      </div>
      <div className="hidden w-full max-w-[400px] flex-col gap-y-2 xl:flex">
        <LocationsSalesChannelsSection location={location} />
      </div>
      <Outlet />
    </div>
  )
}
