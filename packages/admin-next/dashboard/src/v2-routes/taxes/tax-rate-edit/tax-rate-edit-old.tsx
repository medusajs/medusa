import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { useTaxRate } from "../../../hooks/api/tax-rates"
import { TaxRateEditForm } from "./components"

export const TaxRateEdit = () => {
  const { t } = useTranslation()
  const params = useParams()

  const {
    tax_rate: taxRate,
    isLoading,
    isError,
    error,
  } = useTaxRate(params.taxRateId!)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("taxRates.edit.title")}</Heading>
      </RouteDrawer.Header>

      {!isLoading && taxRate && <TaxRateEditForm taxRate={taxRate} />}
    </RouteDrawer>
  )
}
