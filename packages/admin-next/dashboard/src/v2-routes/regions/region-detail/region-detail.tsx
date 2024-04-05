import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { RegionCountrySection } from "./components/region-country-section"
import { RegionGeneralSection } from "./components/region-general-section"
import { useV2Region } from "../../../lib/api-v2/region"
import { regionLoader } from "./loader"

export const RegionDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof regionLoader>
  >

  const { id } = useParams()
  const { region, isLoading, isError, error } = useV2Region(
    id!,
    { fields: "*payment_providers" },
    {
      initialData,
    }
  )

  // TODO: Move to loading.tsx and set as Suspense fallback for the route
  if (isLoading || !region) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <RegionGeneralSection region={region} />
      <RegionCountrySection region={region} />
      <Outlet />
    </div>
  )
}
