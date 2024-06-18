import { Outlet, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRateList } from "./components/tax-rate-list"

import after from "virtual:medusa/widgets/tax/details/after"
import before from "virtual:medusa/widgets/tax/details/before"
import { TaxRegionDetailSection } from "./components/tax-region-detail-section"

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
        {before.widgets.map((w, i) => {
          return (
            <div key={i}>
              <w.Component data={taxRegion} />
            </div>
          )
        })}
        <TaxRegionDetailSection taxRegion={taxRegion} />
        <TaxRateList taxRegion={taxRegion} isDefault={true} />
        <TaxRateList taxRegion={taxRegion} isDefault={false} />
        {after.widgets.map((w, i) => {
          return (
            <div key={i}>
              <w.Component data={taxRegion} />
            </div>
          )
        })}
        <JsonViewSection data={taxRegion} />
        <Outlet />
      </div>
    )
  )
}
