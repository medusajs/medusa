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
      return <StatusIndicator title="Published" variant="success" />
    case "draft":
      return <StatusIndicator title="Draft" variant="default" />
    case "proposed":
      return <StatusIndicator title="Proposed" variant="warning" />
    case "rejected":
      return <StatusIndicator title="Rejected" variant="danger" />
    default:
      return null
  }
}
