import { LineItem } from "@medusajs/medusa"

export const getFulfillableQuantity = (item: LineItem): number => {
  return item.quantity - (item.fulfilled_quantity || 0)
}
