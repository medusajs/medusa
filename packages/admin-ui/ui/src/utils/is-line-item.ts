import { ClaimOrder, LineItem, Order, Swap } from "@medusajs/medusa"

export const isLineItemCanceled = (
  item: Omit<LineItem, "beforeInsert">,
  order: Omit<Order, "beforeInsert">
) => {
  const { swap_id, claim_order_id } = item
  const travFind = (col: (Swap | ClaimOrder)[], id: string) =>
    col.filter((f) => f.id == id && f.canceled_at).length > 0

  if (swap_id) {
    return travFind(order.swaps, swap_id)
  }
  if (claim_order_id) {
    return travFind(order.claims, claim_order_id)
  }
  return false
}

export const isLineItemReturned = (item: Omit<LineItem, "beforeInsert">) => {
  const { shipped_quantity, returned_quantity } = item

  if (!returned_quantity) {
    return false
  }

  if (shipped_quantity && returned_quantity === shipped_quantity) {
    return true
  }
}

export const isLineItemNotReturnable = (
  item: Omit<LineItem, "beforeInsert">,
  order: Order
) => {
  return isLineItemCanceled(item, order) || isLineItemReturned(item)
}
