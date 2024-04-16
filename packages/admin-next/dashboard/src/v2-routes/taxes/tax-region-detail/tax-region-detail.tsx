import { Outlet, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRateList } from "./components/tax-rate-list"
import { TaxRegionGeneralDetail } from "./components/tax-region-general-detail"

export const TaxRegionDetail = () => {
  const { id } = useParams()
  const { tax_region: taxRegion, isLoading, isError, error } = useTaxRegion(id!)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    taxRegion && (
      <div className="flex flex-col gap-y-2">
        <TaxRegionGeneralDetail taxRegion={taxRegion} />
        <TaxRateList taxRegion={taxRegion} isDefault={true} />
        <TaxRateList taxRegion={taxRegion} isDefault={false} />
        <JsonViewSection data={taxRegion} root="tax_region" />
        <Outlet />
      </div>
    )
  )
}
