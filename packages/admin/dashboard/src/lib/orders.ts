import { AdminOrder, AdminOrderLineItem, HttpTypes } from "@zjedene-medusa/types"

export const getPaymentsFromOrder = (order: HttpTypes.AdminOrder) => {
  return order.payment_collections
    .map((collection: HttpTypes.AdminPaymentCollection) => collection.payments)
    .flat(1)
    .filter(Boolean) as HttpTypes.AdminPayment[]
}

/**
 * Returns a limit for number of reservations that order can have.
 */
export function getReservationsLimitCount(order: AdminOrder) {
  if (!order?.items?.length) {
    return 0
  }

  return order.items.reduce(
    (acc: number, item: AdminOrderLineItem) =>
      acc + (item.variant?.inventory_items?.length || 1),
    0
  )
}
