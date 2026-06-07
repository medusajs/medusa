import { useLoaderData, useParams } from "react-router-dom"
import { useState } from "react"

import { SingleColumnPage } from "../../../components/layout/pages"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRegionDetailSection } from "./components/tax-region-detail-section"
import { TaxRegionProvinceSection } from "./components/tax-region-province-section"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { useExtension } from "../../../providers/extension-provider"
import { TaxRegionOverrideSection } from "./components/tax-region-override-section"
import { TaxRegionSublevelAlert } from "./components/tax-region-sublevel-alert"
import { TaxRegionProviderSection } from "./tax-region-provider-section"
import { taxRegionLoader } from "./loader"
import { PermissionGuard } from "../../../components/common/permission-guard"

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

  const { getWidgets } = useExtension()

  if (isLoading || !taxRegion) {
    return <SingleColumnPageSkeleton sections={4} showJSON />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      data={taxRegion}
      showJSON
      // showMetadata // TOOD -> enable tax region metadata
      widgets={{
        after: getWidgets("tax.details.after"),
        before: getWidgets("tax.details.before"),
      }}
      showRequiredPermissions
    >
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
      <PermissionGuard permission="tax_rate:read">
        <TaxRegionOverrideSection taxRegion={taxRegion} />
      </PermissionGuard>
      <TaxRegionProviderSection taxRegion={taxRegion} />
    </SingleColumnPage>
  )
}
