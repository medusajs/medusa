import { Outlet, useLoaderData } from "react-router-dom"

import { useStockLocations } from "../../../hooks/api/stock-locations"
import LocationListItem from "./components/location-list-item/location-list-item"
import { LOCATION_LIST_FIELDS } from "./constants"
import { shippingListLoader } from "./loader"

import after from "virtual:medusa/widgets/location/list/after"
import before from "virtual:medusa/widgets/location/list/before"
import { LocationListHeader } from "./components/location-list-header"

export function LocationList() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof shippingListLoader>
  >

  const {
    stock_locations: stockLocations = [],
    isError,
    error,
  } = useStockLocations(
    {
      fields: LOCATION_LIST_FIELDS,
    },
    { initialData }
  )

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-3">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <LocationListHeader />
      <div className="flex flex-col gap-3 lg:col-span-2">
        {stockLocations.map((location) => (
          <LocationListItem key={location.id} location={location} />
        ))}
      </div>
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <Outlet />
    </div>
  )
}
