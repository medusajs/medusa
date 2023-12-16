export default async function handler({ data: { id }, container }) {
  const orderService = container.resolve("orderService")
  const segmentService = container.resolve("segmentService")

  const order = await orderService.retrieve(id, {
    select: [
      "shipping_total",
      "discount_total",
      "tax_total",
      "refunded_total",
      "gift_card_total",
      "subtotal",
      "total",
    ],
  })

  const date = new Date()
  const orderData = await segmentService.buildOrder(order)
  const orderEvent = {
    event: "Order Cancelled",
    userId: order.customer_id,
    properties: orderData,
    timestamp: date,
  }

  segmentService.track(orderEvent)
}

export const config = {
  event: "order.canceled",
}
