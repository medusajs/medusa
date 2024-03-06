import { Heading } from "@medusajs/ui"
import { useAdminTaxRate } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditTaxRateForm } from "./components/edit-tax-rate-form"

export const TaxRateEdit = () => {
  const { rate_id } = useParams()
  const { t } = useTranslation()

  const { tax_rate, isLoading, isError, error } = useAdminTaxRate(rate_id!)

  const ready = !isLoading && tax_rate

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("taxes.taxRate.editTaxRate")}</Heading>
      </RouteDrawer.Header>
      {ready && <EditTaxRateForm taxRate={tax_rate} />}
    </RouteDrawer>
  )
}
