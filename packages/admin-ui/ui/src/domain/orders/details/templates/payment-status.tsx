import { useTranslation } from "react-i18next"
import StatusDot from "../../../../components/fundamentals/status-indicator"

export const PaymentStatusComponent = ({ status }) => {
  const { t } = useTranslation()
  switch (status) {
    case "captured":
      return <StatusDot title={t("templates-paid", "Paid")} variant="success" />
    case "awaiting":
      return (
        <StatusDot
          title={t("templates-awaiting-payment", "Awaiting payment")}
          variant="danger"
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
          title={t(
            "templates-payment-status-requires-action",
            "Requires Action"
          )}
          variant="danger"
        />
      )
    default:
      return null
  }
}
