import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"
import { useState } from "react"

import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRegionDetailSection } from "./components/tax-region-detail-section"
import { TaxRegionProvinceSection } from "./components/tax-region-province-section"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
import { TaxRegionOverrideSection } from "./components/tax-region-override-section"
import { TaxRegionSublevelAlert } from "./components/tax-region-sublevel-alert"
import { TaxRegionProviderSection } from "./tax-region-provider-section"
import { taxRegionLoader } from "./loader"

export const TaxRegionDetail = () => {
  const { id } = useParams()
  const [showSublevelRegions, setShowSublevelRegions] = useState(false)

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
    return <SingleColumnPageSkeleton sections={4} showJSON />
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
            <TaxRegionSublevelAlert
              taxRegion={taxRegion}
              showSublevelRegions={showSublevelRegions}
              setShowSublevelRegions={setShowSublevelRegions}
            />
            <TaxRegionDetailSection taxRegion={taxRegion} />
            <TaxRegionProvinceSection
              taxRegion={taxRegion}
              showSublevelRegions={showSublevelRegions}
            />
            <TaxRegionOverrideSection taxRegion={taxRegion} />
            <TaxRegionProviderSection taxRegion={taxRegion} />
            <JsonViewSection data={taxRegion} />
          </>
        ),
      }}
    />
  )
}
