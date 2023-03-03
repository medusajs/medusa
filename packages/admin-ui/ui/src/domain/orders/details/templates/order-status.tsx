import React from "react"

import StatusDot from "../../../../components/fundamentals/status-indicator"

export const OrderStatusComponent = ({ status }) => {
  switch (status) {
    case "completed":
      return <StatusDot title="Completed" variant="success" />
    case "pending":
      return <StatusDot title="Processing" variant="default" />
    case "canceled":
      return <StatusDot title="Canceled" variant="danger" />
    case "requires_action":
      return <StatusDot title="Requires action" variant="danger" />
    default:
      return null
  }
}
