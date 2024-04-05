import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { useApiKey } from "../../../hooks/api/api-keys"
import { EditApiKeyForm } from "./components/edit-api-key-form"

export const ApiKeyManagementEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { apiKey, isLoading, isError, error } = useApiKey(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("apiKeyManagement.editKey")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && !!apiKey && <EditApiKeyForm apiKey={apiKey} />}
    </RouteDrawer>
  )
}
