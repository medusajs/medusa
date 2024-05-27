import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useRegion } from "../../../hooks/api/regions"
import { RegionCountrySection } from "./components/region-country-section"
import { RegionGeneralSection } from "./components/region-general-section"
import { regionLoader } from "./loader"

import after from "virtual:medusa/widgets/region/details/after"
import before from "virtual:medusa/widgets/region/details/before"

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
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={region} />
          </div>
        )
      })}
      <RegionGeneralSection region={region} />
      <RegionCountrySection region={region} />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={region} />
          </div>
        )
      })}
      <JsonViewSection data={region} />
      <Outlet />
    </div>
  )
}
