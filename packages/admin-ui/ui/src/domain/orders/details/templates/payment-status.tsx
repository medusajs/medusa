import StatusDot from "../../../../components/fundamentals/status-indicator"

export const PaymentStatusComponent = ({ status }) => {
  switch (status) {
    case "captured":
      return <StatusDot title="Paid" variant="success" />
    case "awaiting":
      return <StatusDot title="Awaiting payment" variant="danger" />
    case "canceled":
      return <StatusDot title="Canceled" variant="danger" />
    case "requires_action":
      return <StatusDot title="Requires Action" variant="danger" />
    default:
      return null
  }
}
