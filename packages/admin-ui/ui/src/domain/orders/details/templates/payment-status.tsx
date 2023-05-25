import { useTranslation } from "react-i18next"
import StatusDot from "../../../../components/fundamentals/status-indicator"

export const PaymentStatusComponent = ({ status }) => {
  const { t } = useTranslation()
  switch (status) {
    case "captured":
      return <StatusDot title={t("Paid")} variant="success" />
    case "awaiting":
      return <StatusDot title={t("Awaiting payment")} variant="danger" />
    case "canceled":
      return <StatusDot title={t("Canceled")} variant="danger" />
    case "requires_action":
      return <StatusDot title={t("Requires Action")} variant="danger" />
    default:
      return null
  }
}
