import { useAdminRegion } from "medusa-react"
import { Outlet, json, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { RegionGeneralSection } from "./components/region-general-section"
import { RegionShippingOptionSection } from "./components/region-shipping-option-section/region-shipping-option-section"

export const RegionDetail = () => {
  const { id } = useParams()
  const { region, isLoading, isError, error } = useAdminRegion(id!)

  // TODO: Move to loading.tsx and set as Suspense fallback for the route
  if (isLoading) {
    return <div>Loading</div>
  }

  if (isError || !region) {
    if (error) {
      throw error
    }

    throw json("An unknown error occurred", 500)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <RegionGeneralSection region={region} />
      <RegionShippingOptionSection region={region} />
      <JsonViewSection data={region} />
      <Outlet />
    </div>
  )
}
