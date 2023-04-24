import React from "react"

import StatusDot from "../../../../components/fundamentals/status-indicator"

export const FulfillmentStatusComponent = ({ status }) => {
  switch (status) {
    case "partially_returned":
      return <StatusDot title="Partially returned" variant="warning" />
    case "partially_shipped":
      return <StatusDot title="Partially shipped" variant="warning" />
    case "shipped":
      return <StatusDot title="Shipped" variant="success" />
    case "partially_fulfilled":
      return <StatusDot title="Partially fulfilled" variant="warning" />
    case "fulfilled":
      return <StatusDot title="Fulfilled" variant="warning" />
    case "canceled":
      return <StatusDot title="Canceled" variant="danger" />
    case "requires_action":
      return <StatusDot title="Requires Action" variant="danger" />
    default:
      return null
  }
}
