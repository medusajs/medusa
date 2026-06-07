import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPage } from "../../../components/layout/pages"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRegionProvinceDetailSection } from "./components/tax-region-province-detail-section"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { useExtension } from "../../../providers/extension-provider"
import { TaxRegionProvinceOverrideSection } from "./components/tax-region-province-override-section"
import { taxRegionLoader } from "./loader"
import { PermissionGuard } from "../../../components/common/permission-guard"

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

  const { getWidgets } = useExtension()

  if (isLoading || !taxRegion) {
    return <SingleColumnPageSkeleton sections={2} showJSON />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      data={taxRegion}
      showJSON
      widgets={{
        after: getWidgets("tax.details.after"),
        before: getWidgets("tax.details.before"),
      }}
      showRequiredPermissions
    >
      <TaxRegionProvinceDetailSection taxRegion={taxRegion} />
      <PermissionGuard permission="tax_rate:read">
        <TaxRegionProvinceOverrideSection taxRegion={taxRegion} />
      </PermissionGuard>
    </SingleColumnPage>
  )
}
