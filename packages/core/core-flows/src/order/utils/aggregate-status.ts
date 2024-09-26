import { OrderDetailDTO } from "@medusajs/framework/types"
import { isDefined, MathBN } from "@medusajs/framework/utils"

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
    if (MathBN.gt(paymentCollection.captured_amount ?? 0, 0)) {
      paymentStatus[PaymentStatus.CAPTURED] += MathBN.eq(
        paymentCollection.captured_amount as number,
        paymentCollection.amount
      )
        ? 1
        : 0.5
    }

    if (MathBN.gt(paymentCollection.refunded_amount ?? 0, 0)) {
      paymentStatus[PaymentStatus.REFUNDED] += MathBN.eq(
        paymentCollection.refunded_amount as number,
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

  if (
    paymentStatus[PaymentStatus.CANCELED] > 0 &&
    paymentStatus[PaymentStatus.CANCELED] === totalPayments
  ) {
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
    canceled_at: FulfillmentStatus.CANCELED,
    delivered_at: FulfillmentStatus.DELIVERED,
    shipped_at: FulfillmentStatus.SHIPPED,
    packed_at: FulfillmentStatus.FULFILLED,
  }

  for (const fulfillmentCollection of order.fulfillments) {
    // Note: The order of the statusMap keys is important as we break
    // the loop when we have found a match. The match should be prioritized
    // based on order of precedence of statuses
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

  // Whenever there are any unfulfilled items in the order, it should be
  // considered partially_[STATUS] where status is picked up from the hierarchy
  // of statuses
  const hasUnfulfilledItems =
    (order.items || [])?.filter(
      (i) =>
        isDefined(i?.detail?.raw_fulfilled_quantity) &&
        MathBN.lt(i.detail.raw_fulfilled_quantity, i.raw_quantity)
    ).length > 0

  if (fulfillmentStatus[FulfillmentStatus.DELIVERED] > 0) {
    if (
      fulfillmentStatus[FulfillmentStatus.DELIVERED] ===
        totalFulfillmentsExceptCanceled &&
      !hasUnfulfilledItems
    ) {
      return FulfillmentStatus.DELIVERED
    }

    return FulfillmentStatus.PARTIALLY_DELIVERED
  }

  if (fulfillmentStatus[FulfillmentStatus.SHIPPED] > 0) {
    if (
      fulfillmentStatus[FulfillmentStatus.SHIPPED] ===
        totalFulfillmentsExceptCanceled &&
      !hasUnfulfilledItems
    ) {
      return FulfillmentStatus.SHIPPED
    }

    return FulfillmentStatus.PARTIALLY_SHIPPED
  }

  if (fulfillmentStatus[FulfillmentStatus.FULFILLED] > 0) {
    if (
      fulfillmentStatus[FulfillmentStatus.FULFILLED] ===
        totalFulfillmentsExceptCanceled &&
      !hasUnfulfilledItems
    ) {
      return FulfillmentStatus.FULFILLED
    }

    return FulfillmentStatus.PARTIALLY_FULFILLED
  }

  if (
    fulfillmentStatus[FulfillmentStatus.CANCELED] > 0 &&
    fulfillmentStatus[FulfillmentStatus.CANCELED] === totalFulfillments
  ) {
    return FulfillmentStatus.CANCELED
  }

  return FulfillmentStatus.NOT_FULFILLED
}
