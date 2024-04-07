import { Outlet, useParams } from "react-router-dom"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRegionGeneralDetail } from "./components/tax-region-general-detail"

export const TaxRegionDetail = () => {
  const { id } = useParams()
  console.log("id - ", id)
  const { tax_region: taxRegion, isLoading, isError, error } = useTaxRegion(id!)
  console.log("taxRegion - ", taxRegion)
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <TaxRegionGeneralDetail taxRegion={taxRegion} />
      <Outlet />
    </div>
  )
}
