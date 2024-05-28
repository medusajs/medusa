import { OrderDetailDTO } from "@medusajs/types"
import { MathBN } from "@medusajs/utils"

export const getLastPaymentStatus = (order: OrderDetailDTO) => {
  const PaymentStatus = {
    NOT_PAID: "not_paid",
    AWAITING: "awaiting",
    CAPTURED: "captured",
    PARTIALLY_CAPTURED: "partially_captured",
    PARTIALLY_REFUNDED: "partially_refunded",
    REFUNDED: "refunded",
    CANCELED: "canceled",
    REQUIRES_ACTION: "requires_action",
    AUTHORIZED: "authorized",
    PARTIALLY_AUTHORIZED: "partially_authorized",
  }

  let paymentStatus = {}
  for (const status in PaymentStatus) {
    paymentStatus[PaymentStatus[status]] = 0
  }

  for (const paymentCollection of order.payment_collections) {
    if (paymentCollection.captured_amount > 0) {
      paymentStatus[PaymentStatus.CAPTURED] += MathBN.eq(
        paymentCollection.captured_amount,
        paymentCollection.amount
      )
        ? 1
        : 0.5
    }

    if (paymentCollection.refunded_amount > 0) {
      paymentStatus[PaymentStatus.REFUNDED] += MathBN.eq(
        paymentCollection.refunded_amount,
        paymentCollection.amount
      )
        ? 1
        : 0.5
    }

    paymentStatus[paymentCollection.status] += 1
  }

  const totalPayments = order.payment_collections.length
  const totalPaymentExceptCanceled =
    totalPayments - paymentStatus[PaymentStatus.CANCELED]

  if (paymentStatus[PaymentStatus.REQUIRES_ACTION] > 0) {
    return PaymentStatus.REQUIRES_ACTION
  }

  if (paymentStatus[PaymentStatus.REFUNDED] > 0) {
    if (paymentStatus[PaymentStatus.REFUNDED] === totalPaymentExceptCanceled) {
      return PaymentStatus.REFUNDED
    }

    return PaymentStatus.PARTIALLY_REFUNDED
  }

  if (paymentStatus[PaymentStatus.CAPTURED] > 0) {
    if (paymentStatus[PaymentStatus.CAPTURED] === totalPaymentExceptCanceled) {
      return PaymentStatus.CAPTURED
    }

    return PaymentStatus.PARTIALLY_CAPTURED
  }

  if (paymentStatus[PaymentStatus.AUTHORIZED] > 0) {
    if (
      paymentStatus[PaymentStatus.AUTHORIZED] === totalPaymentExceptCanceled
    ) {
      return PaymentStatus.AUTHORIZED
    }

    return PaymentStatus.PARTIALLY_AUTHORIZED
  }

  if (paymentStatus[PaymentStatus.CANCELED] === totalPayments) {
    return PaymentStatus.CANCELED
  }

  if (paymentStatus[PaymentStatus.AWAITING] > 0) {
    return PaymentStatus.AWAITING
  }

  return PaymentStatus.NOT_PAID
}

export const getLastFulfillmentStatus = (order: OrderDetailDTO) => {
  const FulfillmentStatus = {
    NOT_FULFILLED: "not_fulfilled",
    PARTIALLY_FULFILLED: "partially_fulfilled",
    FULFILLED: "fulfilled",
    PARTIALLY_SHIPPED: "partially_shipped",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    PARTIALLY_DELIVERED: "partially_delivered",
    CANCELED: "canceled",
  }

  let fulfillmentStatus = {}
  for (const status in FulfillmentStatus) {
    fulfillmentStatus[FulfillmentStatus[status]] = 0
  }

  const statusMap = {
    packed_at: FulfillmentStatus.FULFILLED,
    shipped_at: FulfillmentStatus.SHIPPED,
    delivered_at: FulfillmentStatus.DELIVERED,
    canceled_at: FulfillmentStatus.CANCELED,
  }
  for (const fulfillmentCollection of order.fulfillments) {
    for (const key in statusMap) {
      if (fulfillmentCollection[key]) {
        fulfillmentStatus[statusMap[key]] += 1
        break
      }
    }
  }

  const totalFulfillments = order.fulfillments.length
  const totalFulfillmentsExceptCanceled =
    totalFulfillments - fulfillmentStatus[FulfillmentStatus.CANCELED]

  if (fulfillmentStatus[FulfillmentStatus.DELIVERED] > 0) {
    if (
      fulfillmentStatus[FulfillmentStatus.DELIVERED] ===
      totalFulfillmentsExceptCanceled
    ) {
      return FulfillmentStatus.DELIVERED
    }

    return FulfillmentStatus.PARTIALLY_DELIVERED
  }

  if (fulfillmentStatus[FulfillmentStatus.SHIPPED] > 0) {
    if (
      fulfillmentStatus[FulfillmentStatus.SHIPPED] ===
      totalFulfillmentsExceptCanceled
    ) {
      return FulfillmentStatus.SHIPPED
    }

    return FulfillmentStatus.PARTIALLY_SHIPPED
  }

  if (fulfillmentStatus[FulfillmentStatus.FULFILLED] > 0) {
    if (
      fulfillmentStatus[FulfillmentStatus.FULFILLED] ===
      totalFulfillmentsExceptCanceled
    ) {
      return FulfillmentStatus.FULFILLED
    }

    return FulfillmentStatus.PARTIALLY_FULFILLED
  }

  if (fulfillmentStatus[FulfillmentStatus.CANCELED] > 0) {
    if (fulfillmentStatus[FulfillmentStatus.CANCELED] === totalFulfillments) {
      return FulfillmentStatus.CANCELED
    }
  }

  return FulfillmentStatus.NOT_FULFILLED
}
