import { useAdminRegion } from "medusa-react"
import { Outlet, useNavigate, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { RegionGeneralSection } from "./components/region-general-section"
import { RegionShippingOptionSection } from "./components/region-shipping-option-section/region-shipping-option-section"

export const RegionDetail = () => {
  const { id } = useParams()
  const { region, isLoading, isError, error } = useAdminRegion(id!)
  const navigate = useNavigate()

  // TODO: Move to loading.tsx and set as Suspense fallback for the route
  if (isLoading) {
    return <div>Loading</div>
  }

  // TODO: Move to error.tsx and set as ErrorBoundary for the route
  if (isError || !region) {
    const err = error ? JSON.parse(JSON.stringify(error)) : null
    return (
      <div>
        {(err as Error & { status: number })?.status === 404 ? (
          <div>Not found</div>
        ) : (
          <div>Something went wrong!</div>
        )}
      </div>
    )
  }

  console.log("RegionDetail")

  return (
    <div className="flex flex-col gap-y-2">
      <RegionGeneralSection region={region} />
      <RegionShippingOptionSection region={region} />
      <JsonViewSection data={region} />
      <Outlet />
    </div>
  )
}
