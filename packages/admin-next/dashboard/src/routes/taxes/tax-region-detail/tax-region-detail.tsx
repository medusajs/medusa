import { useParams } from "react-router-dom"

import { TwoColumnPage } from "../../../components/layout/pages"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRateList } from "./components/tax-rate-list"
import { TaxRegionDetailSection } from "./components/tax-region-detail-section"

import after from "virtual:medusa/widgets/tax/details/after"
import before from "virtual:medusa/widgets/tax/details/before"
import { TaxRegionOverrideSection } from "./components/tax-region-override-section"

export const TaxRegionDetail = () => {
  const { id } = useParams()
  const { tax_region: taxRegion, isLoading, isError, error } = useTaxRegion(id!)

  if (isLoading || !taxRegion) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <TwoColumnPage
      data={taxRegion}
      showJSON
      hasOutlet
      widgets={{
        after,
        before,
        sideAfter: { widgets: [] },
        sideBefore: { widgets: [] },
      }}
    >
      <TwoColumnPage.Main>
        <TaxRegionDetailSection taxRegion={taxRegion} />
        <TaxRateList taxRegion={taxRegion} isDefault={true} />
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <TaxRegionOverrideSection taxRegion={taxRegion} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
