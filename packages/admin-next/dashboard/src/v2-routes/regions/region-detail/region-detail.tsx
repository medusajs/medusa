import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useRegion } from "../../../hooks/api/regions"
import { RegionCountrySection } from "./components/region-country-section"
import { RegionGeneralSection } from "./components/region-general-section"
import { regionLoader } from "./loader"

export const RegionDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof regionLoader>
  >

  const { id } = useParams()
  const {
    region,
    isPending: isLoading,
    isError,
    error,
  } = useRegion(
    id!,
    { fields: "*payment_providers,*countries" },
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
      <JsonViewSection data={region} />
      <Outlet />
    </div>
  )
}
