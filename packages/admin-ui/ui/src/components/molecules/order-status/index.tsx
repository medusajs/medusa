import React from "react"
import StatusIndicator from "../../fundamentals/status-indicator"

type PaymentStatusProps = {
  className?: string
  paymentStatus: string
}

type FulfillmentStatusProps = {
  className?: string
  fulfillmentStatus: string
}

type OrderStatusProps = {
  className?: string
  orderStatus: string
}

type ReturnStatusProps = {
  className?: string
  returnStatus: string
}

type RefundStatusProps = {
  className?: string
  refundStatus: string
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  className,
  paymentStatus,
}) => {
  switch (paymentStatus) {
    case "captured":
      return (
        <StatusIndicator className={className} title="Paid" variant="success" />
      )
    case "awaiting":
      return (
        <StatusIndicator
          className={className}
          title="Awaiting"
          variant="default"
        />
      )
    case "not_paid":
      return (
        <StatusIndicator
          className={className}
          title="Not paid"
          variant="default"
        />
      )
    case "canceled":
      return (
        <StatusIndicator
          className={className}
          title="Canceled"
          variant="danger"
        />
      )
    case "requires_action":
      return (
        <StatusIndicator
          className={className}
          title="Requires Action"
          variant="danger"
        />
      )
    default:
      return null
  }
}

export const OrderStatus: React.FC<OrderStatusProps> = ({
  className,
  orderStatus,
}) => {
  switch (orderStatus) {
    case "completed":
      return (
        <StatusIndicator
          className={className}
          title="Completed"
          variant="success"
        />
      )
    case "pending":
      return (
        <StatusIndicator
          className={className}
          title="Processing"
          variant="default"
        />
      )
    case "canceled":
      return (
        <StatusIndicator
          className={className}
          title="Canceled"
          variant="danger"
        />
      )
    case "requires_action":
      return (
        <StatusIndicator
          className={className}
          title="Rejected"
          variant="danger"
        />
      )
    default:
      return null
  }
}

export const FulfillmentStatus: React.FC<FulfillmentStatusProps> = ({
  className,
  fulfillmentStatus,
}) => {
  switch (fulfillmentStatus) {
    case "shipped":
      return (
        <StatusIndicator
          className={className}
          title="Shipped"
          variant="success"
        />
      )
    case "partially_shipped":
      return (
        <StatusIndicator
          className={className}
          title="Partially Shipped"
          variant="warning"
        />
      )
    case "fulfilled":
      return (
        <StatusIndicator
          className={className}
          title="Fulfilled"
          variant="warning"
        />
      )
    case "canceled":
      return (
        <StatusIndicator
          className={className}
          title="Canceled"
          variant="danger"
        />
      )
    case "partially_fulfilled":
      return (
        <StatusIndicator
          className={className}
          title="Partially fulfilled"
          variant="warning"
        />
      )
    case "not_fulfilled":
      return (
        <StatusIndicator
          className={className}
          title="Not fulfilled"
          variant="default"
        />
      )
    case "requires_action":
      return (
        <StatusIndicator
          className={className}
          title="Requires Action"
          variant="danger"
        />
      )
    default:
      return null
  }
}

export const ReturnStatus: React.FC<ReturnStatusProps> = ({
  className,
  returnStatus,
}) => {
  switch (returnStatus) {
    case "received":
      return (
        <StatusIndicator
          className={className}
          title="Received"
          variant="success"
        />
      )
    case "requested":
      return (
        <StatusIndicator
          className={className}
          title="Requested"
          variant="default"
        />
      )
    case "canceled":
      return (
        <StatusIndicator
          className={className}
          title="Canceled"
          variant="danger"
        />
      )
    case "requires_action":
      return (
        <StatusIndicator
          className={className}
          title="Requires Action"
          variant="danger"
        />
      )
    default:
      return null
  }
}

export const RefundStatus: React.FC<RefundStatusProps> = ({
  className,
  refundStatus,
}) => {
  switch (refundStatus) {
    case "na":
      return (
        <StatusIndicator className={className} title="N/A" variant="default" />
      )
    case "not_refunded":
      return (
        <StatusIndicator
          className={className}
          title="Refunded"
          variant="default"
        />
      )
    case "refunded":
      return (
        <StatusIndicator
          className={className}
          title="Refunded"
          variant="success"
        />
      )
    default:
      return null
  }
}
