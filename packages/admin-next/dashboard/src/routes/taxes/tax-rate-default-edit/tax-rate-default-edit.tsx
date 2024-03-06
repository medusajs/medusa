import { Heading } from "@medusajs/ui"
import { useAdminRegion } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditDefaultTaxRateForm } from "./components/edit-tax-form"

export const TaxRateDefaultEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { region, isLoading, isError, error } = useAdminRegion(id!)

  const ready = !isLoading && region

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("taxes.settings.editTaxSettings")}</Heading>
      </RouteDrawer.Header>
      {ready && <EditDefaultTaxRateForm region={region} />}
    </RouteDrawer>
  )
}
