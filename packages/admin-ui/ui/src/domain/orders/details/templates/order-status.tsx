import { useTranslation } from "react-i18next"
import StatusDot from "../../../../components/fundamentals/status-indicator"

export const OrderStatusComponent = ({ status }) => {
  const { t } = useTranslation()

  switch (status) {
    case "completed":
      return (
        <StatusDot
          title={t("templates-completed", "Completed")}
          variant="success"
        />
      )
    case "pending":
      return (
        <StatusDot
          title={t("templates-processing", "Processing")}
          variant="default"
        />
      )
    case "canceled":
      return (
        <StatusDot
          title={t("templates-canceled", "Canceled")}
          variant="danger"
        />
      )
    case "requires_action":
      return (
        <StatusDot
          title={t("templates-requires-action", "Requires action")}
          variant="danger"
        />
      )
    default:
      return null
  }
}
