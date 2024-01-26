import { Drawer, Heading } from "@medusajs/ui"
import { useAdminPublishableApiKey } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { EditApiKeyForm } from "./components/edit-api-key-form"

export const ApiKeyManagementEdit = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()
  const { id } = useParams()
  const { t } = useTranslation()

  const { publishable_api_key, isLoading, isError, error } =
    useAdminPublishableApiKey(id!)

  const handleSuccessfulSubmit = () => {
    onOpenChange(false, true)
  }

  if (isError) {
    throw error
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>{t("apiKeyManagement.editKey")}</Heading>
        </Drawer.Header>
        {!isLoading && publishable_api_key && (
          <EditApiKeyForm
            apiKey={publishable_api_key}
            onSuccessfulSubmit={handleSuccessfulSubmit}
            subscribe={subscribe}
          />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
