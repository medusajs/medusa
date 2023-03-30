import { ClaimItem, LineItem, Order } from "@medusajs/medusa"

export const getAllReturnableItems = (
  order: Omit<Order, "beforeInserts">,
  isClaim: boolean
) => {
  let orderItems = order.items.reduce(
    (map, obj) =>
      map.set(obj.id, {
        ...obj,
      }),
    new Map<string, Omit<LineItem, "beforeInsert">>()
  )

  let claimedItems: ClaimItem[] = []

  if (order.claims && order.claims.length) {
    for (const claim of order.claims) {
      if (claim.return_order?.status !== "canceled") {
        claim.claim_items = claim.claim_items ?? []
        claimedItems = [...claimedItems, ...claim.claim_items]
      }

      if (
        claim.fulfillment_status === "not_fulfilled" &&
        claim.payment_status === "na"
      ) {
        continue
      }

      if (claim.additional_items && claim.additional_items.length) {
        orderItems = claim.additional_items
          .filter(
            (it) =>
              it.shipped_quantity ||
              it.shipped_quantity === it.fulfilled_quantity
          )
          .reduce((map, obj) => map.set(obj.id, { ...obj }), orderItems)
      }
    }
  }

  if (!isClaim) {
    if (order.swaps && order.swaps.length) {
      for (const swap of order.swaps) {
        if (swap.fulfillment_status === "not_fulfilled") {
          continue
        }

        orderItems = swap.additional_items.reduce(
          (map, obj) =>
            map.set(obj.id, {
              ...obj,
            }),
          orderItems
        )
      }
    }
  }

  for (const item of claimedItems) {
    const i = orderItems.get(item.item_id)
    if (i) {
      i.quantity = i.quantity - item.quantity
      i.quantity !== 0 ? orderItems.set(i.id, i) : orderItems.delete(i.id)
    }
  }

  return [...orderItems.values()]
}
