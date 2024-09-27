import { AdminOrderLineItem } from "@medusajs/types"

export function getReturnableQuantity(item: AdminOrderLineItem): number {
  const {
    delivered_quantity,
    return_received_quantity,
    return_dismissed_quantity,
    return_requested_quantity,
  } = item.detail

  return (
    delivered_quantity -
    (return_received_quantity +
      return_requested_quantity +
      return_dismissed_quantity)
  )
}
