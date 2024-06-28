import { AdminOrderLineItem } from "@medusajs/types"

export function getReturnableQuantity(item: AdminOrderLineItem): number {
  const {
    // TODO: this should be `fulfilled_quantity`? now there is check on the BD that we can't return more quantity than we shipped but some items don't require shipping
    shipped_quantity,
    return_received_quantity,
    return_dismissed_quantity, // TODO: check this
    return_requested_quantity,
  } = item.detail

  return (
    shipped_quantity - (return_received_quantity + return_requested_quantity)
  )
}
