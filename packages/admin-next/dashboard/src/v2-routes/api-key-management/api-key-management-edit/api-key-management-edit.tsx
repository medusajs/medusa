import { Heading } from "@medusajs/ui"
import { adminPublishableApiKeysKeys, useAdminCustomQuery } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditApiKeyForm } from "./components/edit-api-key-form"

export const ApiKeyManagementEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { data, isLoading, isError, error } = useAdminCustomQuery(
    `/api-keys/${id}`,
    [adminPublishableApiKeysKeys.detail(id!)]
  )

  if (isError || !data?.api_key) {
    if (error) {
      throw error
    }
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("apiKeyManagement.editKey")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && data?.api_key && <EditApiKeyForm apiKey={data?.api_key} />}
    </RouteDrawer>
  )
}
