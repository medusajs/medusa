import { Alert, Button } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { RouteFocusModal } from "../../../../../components/route-modal"

export const ApiKeySalesChannelsFallback = () => {
  const { t } = useTranslation()

  return (
    <div className="flex size-full flex-col">
      <RouteFocusModal.Header>
        <div className="flex items-center justify-end">
          <RouteFocusModal.Close asChild>
            <Button variant="secondary" size="small">
              {t("actions.cancel")}
            </Button>
          </RouteFocusModal.Close>
        </div>
      </RouteFocusModal.Header>
      <RouteFocusModal.Body className="flex flex-1 items-center justify-center">
        <Alert variant="warning">
          {t("apiKeyManagement.warnings.salesChannelsSecretKey")}
        </Alert>
      </RouteFocusModal.Body>
    </div>
  )
}
