import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRegionProvinceDetailSection } from "./components/tax-region-province-detail-section"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { TaxRegionProvinceOverrideSection } from "./components/tax-region-province-override-section"
import { taxRegionLoader } from "./loader"

export const TaxRegionDetail = () => {
  const { province_id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof taxRegionLoader>
  >

  const {
    tax_region: taxRegion,
    isLoading,
    isError,
    error,
  } = useTaxRegion(province_id!, undefined, { initialData })

  if (isLoading || !taxRegion) {
    return <SingleColumnPageSkeleton sections={2} showJSON />
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="tax.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={taxRegion}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="TaxRegionProvinceDetailSection">
              <TaxRegionProvinceDetailSection taxRegion={taxRegion} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="TaxRegionProvinceOverrideSection">
              <TaxRegionProvinceOverrideSection taxRegion={taxRegion} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(taxRegion, { metadata: false, permissions: false })}
          </>
        ),
      }}
    />
  )
}
