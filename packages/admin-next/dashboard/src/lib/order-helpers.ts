import { FulfillmentStatus, PaymentStatus } from "@medusajs/medusa"
import { TFunction } from "i18next"

export const getOrderPaymentStatus = (
  t: TFunction<"translation">,
  status: PaymentStatus
) => {
  const [label, color] = {
    not_paid: [t("orders.payment.status.notPaid"), "red"],
    awaiting: [t("orders.payment.status.awaiting"), "orange"],
    captured: [t("orders.payment.status.captured"), "green"],
    refunded: [t("orders.payment.status.refunded"), "green"],
    partially_refunded: [
      t("orders.payment.status.partiallyRefunded"),
      "orange",
    ],
    canceled: [t("orders.payment.status.canceled"), "red"],
    requires_action: [t("orders.payment.status.requiresAction"), "orange"],
  }[status] as [string, "red" | "orange" | "green"]

  return { label, color }
}

export const getOrderFulfillmentStatus = (
  t: TFunction<"translation">,
  status: FulfillmentStatus
) => {
  const [label, color] = {
    not_fulfilled: [t("orders.fulfillment.status.notFulfilled"), "red"],
    partially_fulfilled: [
      t("orders.fulfillment.status.partiallyFulfilled"),
      "orange",
    ],
    fulfilled: [t("orders.fulfillment.status.fulfilled"), "green"],
    partially_shipped: [
      t("orders.fulfillment.status.partiallyShipped"),
      "orange",
    ],
    shipped: [t("orders.fulfillment.status.shipped"), "green"],
    partially_returned: [
      t("orders.fulfillment.status.partiallyReturned"),
      "orange",
    ],
    returned: [t("orders.fulfillment.status.returned"), "green"],
    canceled: [t("orders.fulfillment.status.canceled"), "red"],
    requires_action: [t("orders.fulfillment.status.requiresAction"), "orange"],
  }[status] as [string, "red" | "orange" | "green"]

  return { label, color }
}
