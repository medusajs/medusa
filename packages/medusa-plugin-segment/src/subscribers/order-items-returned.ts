export default async function handler({ data: { id, return_id }, container }) {
  const orderService = container.resolve("orderService")
  const returnService = container.resolve("returnService")
  const segmentService = container.resolve("segmentService")

  const order = await orderService.retrieveWithTotals(id, {
    relations: [
      "customer",
      "billing_address",
      "shipping_address",
      "discounts",
      "discounts.rule",
      "shipping_methods",
      "shipping_methods.shipping_option",
      "payments",
      "fulfillments",
      "returns",
      "items",
      "gift_cards",
      "gift_card_transactions",
      "swaps",
      "swaps.return_order",
      "swaps.payment",
      "swaps.shipping_methods",
      "swaps.shipping_methods.shipping_option",
      "swaps.shipping_address",
      "swaps.additional_items",
      "swaps.fulfillments",
    ],
  })

  const ret = await returnService.retrieve(return_id, {
    relations: ["items", "items.reason"],
  })

  const shipping: object[] = []
  if (ret.shipping_method && ret.shipping_method.price) {
    shipping.push({
      ...ret.shipping_method,
      price: -1 * (ret.shipping_method.price / 100),
    })
  }

  let merged = [...order.items]

  // merge items from order with items from order swaps
  if (order.swaps && order.swaps.length) {
    for (const s of order.swaps) {
      merged = [...merged, ...s.additional_items]
    }
  }

  const toBuildFrom = {
    ...order,
    shipping_methods: shipping,
    items: ret.items.map((i) => {
      const li = merged.find((l) => l.id === i.item_id)
      if (i.reason) {
        li.reason = i.reason
      }

      if (i.note) {
        li.note = i.note
      }
      return li
    }),
  }

  const orderData = await segmentService.buildOrder(toBuildFrom)
  const orderEvent = {
    event: "Order Refunded",
    userId: order.customer_id,
    properties: orderData,
    timestamp: new Date(),
  }

  segmentService.track(orderEvent)
}

export const config = {
  event: "order.items-returned",
}
