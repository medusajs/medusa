import { useTranslation } from "react-i18next"
import StatusDot from "../../../../components/fundamentals/status-indicator"

export const FulfillmentStatusComponent = ({ status }) => {
  const { t } = useTranslation()

  switch (status) {
    case "shipped":
      return (
        <StatusDot
          title={t("templates-shipped", "Shipped")}
          variant="success"
        />
      )
    case "fulfilled":
      return (
        <StatusDot
          title={t("templates-fulfilled", "Fulfilled")}
          variant="warning"
        />
      )
    case "canceled":
      return (
        <StatusDot
          title={t("templates-canceled", "Canceled")}
          variant="danger"
        />
      )
    case "partially_fulfilled":
      return (
        <StatusDot
          title={t("templates-partially-fulfilled", "Partially fulfilled")}
          variant="warning"
        />
      )
    case "requires_action":
      return (
        <StatusDot
          title={t(
            "templates-fulfillment-status-requires-action",
            "Requires Action"
          )}
          variant="danger"
        />
      )
    case "not_fulfilled":
      return (
        <StatusDot
          title={t("templates-awaiting-fulfillment", "Awaiting fulfillment")}
          variant="danger"
        />
      )
    case "partially_shipped":
      return (
        <StatusDot
          title={t("templates-partially-shipped", "Partially Shipped")}
          variant="warning"
        />
      )
    default:
      return null
  }
}
