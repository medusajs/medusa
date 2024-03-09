import { Heading } from "@medusajs/ui"
import { useAdminRegion, useAdminStoreTaxProviders } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditTaxSettingsForm } from "./components/edit-tax-form"

export const TaxEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { region, isLoading, isError, error } = useAdminRegion(id!)
  const {
    tax_providers,
    isLoading: isLoadingTaxProvider,
    isError: isTaxProviderError,
    error: taxProviderError,
  } = useAdminStoreTaxProviders()

  const ready = !isLoading && region && !isLoadingTaxProvider && tax_providers

  if (isError) {
    throw error
  }

  if (isTaxProviderError) {
    throw taxProviderError
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("taxes.settings.editTaxSettings")}</Heading>
      </RouteDrawer.Header>
      {ready && (
        <EditTaxSettingsForm region={region} taxProviders={tax_providers} />
      )}
    </RouteDrawer>
  )
}
