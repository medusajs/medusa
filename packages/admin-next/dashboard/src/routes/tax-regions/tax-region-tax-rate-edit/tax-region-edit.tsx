import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useTaxRate } from "../../../hooks/api/tax-rates"
import { TaxRegionTaxRateEditForm } from "./components/tax-region-tax-rate-edit-form"

export const TaxRegionEdit = () => {
  const { t } = useTranslation()
  const { tax_rate_id } = useParams()

  const { tax_rate, isPending, isError, error } = useTaxRate(tax_rate_id!)

  const ready = !isPending && !!tax_rate

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("taxRegions.taxRates.edit.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("taxRegions.taxRates.edit.hint")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {ready && <TaxRegionTaxRateEditForm taxRate={tax_rate} />}
    </RouteDrawer>
  )
}
