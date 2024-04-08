import { AdminTaxRegionResponse } from "@medusajs/types"
import { Outlet, useParams } from "react-router-dom"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRateList } from "./components/tax-rate-list"
import { TaxRegionGeneralDetail } from "./components/tax-region-general-detail"

const RegionTaxRates = ({
  taxRegion,
}: {
  taxRegion: AdminTaxRegionResponse["tax_region"]
}) => {
  const { tax_rates: taxRates = [] } = taxRegion

  return taxRates.map((taxRate) => {
    return <div>{taxRate.id}</div>
  })
}

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

        <TaxRateList taxRegion={taxRegion} />
        <Outlet />
      </div>
    )
  )
}
