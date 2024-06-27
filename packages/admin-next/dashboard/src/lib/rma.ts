import { AdminOrderLineItem } from "@medusajs/types"

export function getReturnableQuantity(item: AdminOrderLineItem): number {
  const {
    quantity, // TODO: do we use shipped_quantity / fulfilled_quantity here?
    return_received_quantity,
    return_dismissed_quantity, // TODO: check this
    return_requested_quantity,
  } = item.detail

  return quantity - (return_received_quantity + return_requested_quantity)
}
