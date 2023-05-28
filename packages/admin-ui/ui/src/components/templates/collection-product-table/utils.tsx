import { Translation } from "react-i18next"
import StatusIndicator from "../../fundamentals/status-indicator"

export type SimpleProductType = {
  id: string
  thumbnail?: string
  title: string
  status: string
  created_at: Date
}

export const decideStatus = (status: string) => {
  switch (status) {
    case "published":
      return (
        <Translation>
          {(t) => <StatusIndicator title={t("Published")} variant="success" />}
        </Translation>
      )
    case "draft":
      return (
        <Translation>
          {(t) => <StatusIndicator title={t("Draft")} variant="default" />}
        </Translation>
      )
    case "proposed":
      return (
        <Translation>
          {(t) => <StatusIndicator title={t("Proposed")} variant="warning" />}
        </Translation>
      )
    case "rejected":
      return (
        <Translation>
          {(t) => <StatusIndicator title={t("Rejected")} variant="danger" />}
        </Translation>
      )
    default:
      return null
  }
}
