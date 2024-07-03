import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPage } from "../../../components/layout/pages"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRegionDetailSection } from "./components/tax-region-detail-section"
import { TaxRegionProvinceSection } from "./components/tax-region-province-section"

import after from "virtual:medusa/widgets/tax/details/after"
import before from "virtual:medusa/widgets/tax/details/before"
import { TaxRegionOverrideSection } from "./components/tax-region-override-section"
import { taxRegionLoader } from "./loader"

export const TaxRegionDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof taxRegionLoader>
  >

  const {
    tax_region: taxRegion,
    isLoading,
    isError,
    error,
  } = useTaxRegion(id!, undefined, { initialData })

  if (isLoading || !taxRegion) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      data={taxRegion}
      showJSON
      hasOutlet
      widgets={{
        after,
        before,
      }}
    >
      <TaxRegionDetailSection taxRegion={taxRegion} />
      <TaxRegionProvinceSection taxRegion={taxRegion} />
      <TaxRegionOverrideSection taxRegion={taxRegion} />
    </SingleColumnPage>
  )
}
