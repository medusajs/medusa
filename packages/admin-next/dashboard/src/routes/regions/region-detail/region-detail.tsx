import { useAdminRegion } from "medusa-react"
import { Outlet, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { RegionCountrySection } from "./components/region-country-section"
import { RegionGeneralSection } from "./components/region-general-section"
import { RegionShippingOptionSection } from "./components/region-shipping-option-section"

export const RegionDetail = () => {
  const { id } = useParams()
  const { region, isLoading, isError, error } = useAdminRegion(id!)

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
      <RegionShippingOptionSection region={region} />
      <JsonViewSection data={region} />
      <Outlet />
    </div>
  )
}
