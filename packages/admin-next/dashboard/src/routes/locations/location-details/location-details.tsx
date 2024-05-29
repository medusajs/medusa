import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { LocationGeneralSection } from "./components/location-general-section"
import LocationsSalesChannelsSection from "./components/location-sales-channels-section/locations-sales-channels-section"
import { locationLoader } from "./loader"

import after from "virtual:medusa/widgets/location/details/after"
import before from "virtual:medusa/widgets/location/details/before"
import sideAfter from "virtual:medusa/widgets/location/details/side/after"
import sideBefore from "virtual:medusa/widgets/location/details/side/before"
import { detailsFields } from "./const"

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
      fields: detailsFields,
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
    <div className="flex flex-col gap-y-3">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={location} />
          </div>
        )
      })}
      <div className="flex flex-col gap-x-4 lg:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-2">
          <LocationGeneralSection location={location} />
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={location} />
              </div>
            )
          })}
          <div className="hidden xl:block">
            <JsonViewSection data={location} />
          </div>
        </div>
        <div className="hidden w-full max-w-[400px] flex-col gap-y-2 xl:flex">
          {sideBefore.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={location} />
              </div>
            )
          })}
          <LocationsSalesChannelsSection location={location} />
          {sideAfter.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={location} />
              </div>
            )
          })}
          <div className="xl:hidden">
            <JsonViewSection data={location} />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
