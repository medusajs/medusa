import { useTranslation } from "react-i18next"
import StatusDot from "../../../../components/fundamentals/status-indicator"

export const FulfillmentStatusComponent = ({ status }) => {
  const { t } = useTranslation()

  switch (status) {
    case "shipped":
      return <StatusDot title={t("Shipped")} variant="success" />
    case "fulfilled":
      return <StatusDot title={t("Fulfilled")} variant="warning" />
    case "canceled":
      return <StatusDot title={t("Canceled")} variant="danger" />
    case "partially_fulfilled":
      return <StatusDot title={t("Partially fulfilled")} variant="warning" />
    case "requires_action":
      return <StatusDot title={t("Requires Action")} variant="danger" />
    case "not_fulfilled":
      return <StatusDot title={t("Awaiting fulfillment")} variant="danger" />
    case "partially_shipped":
      return <StatusDot title={t("Partially Shipped")} variant="warning" />
    default:
      return null
  }
}
