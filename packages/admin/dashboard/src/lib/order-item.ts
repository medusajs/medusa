import { AdminOrderLineItem } from "@medusajs/types"

export const getFulfillableQuantity = (item: AdminOrderLineItem) => {
  return item.quantity - item.detail.fulfilled_quantity
}
