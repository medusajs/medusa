import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRegionCreateWithDefaultRateForm } from "./components"

export const TaxRegionCreateDefaultRate = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const { tax_region: taxRegion } = useTaxRegion(
    id!,
    {},
    {
      enabled: !!id,
    }
  )

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("taxRegions.create.title")}</Heading>
      </RouteDrawer.Header>

      <TaxRegionCreateWithDefaultRateForm taxRegion={taxRegion} />
    </RouteDrawer>
  )
}
