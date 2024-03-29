import { Heading } from "@medusajs/ui"
import { useAdminPublishableApiKey } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditApiKeyForm } from "./components/edit-api-key-form"

export const ApiKeyManagementEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { publishable_api_key, isLoading, isError, error } =
    useAdminPublishableApiKey(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("apiKeyManagement.editKey")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && publishable_api_key && (
        <EditApiKeyForm apiKey={publishable_api_key} />
      )}
    </RouteDrawer>
  )
}
