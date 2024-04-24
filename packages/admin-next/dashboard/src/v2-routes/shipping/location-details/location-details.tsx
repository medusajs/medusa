import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { LocationGeneralSection } from "./components/location-general-section"
import { locationLoader } from "./loader"
import { useStockLocation } from "../../../hooks/api/stock-locations"

export const LocationDetails = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof locationLoader>
  >

  const { id } = useParams()
  const {
    stock_location: location,
    isPending: isLoading,
    isError,
    error,
  } = useStockLocation(
    id!,
    { fields: "*payment_providers,*countries" },
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
    <div className="flex flex-col gap-y-2">
      <LocationGeneralSection location={location} />
      <JsonViewSection data={location} />
      <Outlet />
    </div>
  )
}
