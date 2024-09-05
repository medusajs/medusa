import { AdminOrderLineItem } from "@medusajs/types"

export function getReturnableQuantity(item: AdminOrderLineItem): number {
  const {
    shipped_quantity,
    return_received_quantity,
    return_dismissed_quantity,
    return_requested_quantity,
  } = item.detail

  return (
    shipped_quantity -
    (return_received_quantity +
      return_requested_quantity +
      return_dismissed_quantity)
  )
}
