export default async function handler({
  data: { id, fulfillment_id },
  container,
}) {
  const orderService = container.resolve("orderService")
  const fulfillmentService = container.resolve("fulfillmentService")
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

  const fulfillment = await fulfillmentService.retrieve(fulfillment_id, {
    relations: ["items"],
  })

  const toBuildFrom = {
    ...order,
    provider_id: fulfillment.provider,
    items: fulfillment.items.map((i) =>
      order.items.find((l) => l.id === i.item_id)
    ),
  }

  const orderData = await segmentService.buildOrder(toBuildFrom)
  const orderEvent = {
    event: "Order Shipped",
    userId: order.customer_id,
    properties: orderData,
    timestamp: fulfillment.shipped_at,
  }

  segmentService.track(orderEvent)
}

export const config = {
  event: "order.shipment_created",
}
