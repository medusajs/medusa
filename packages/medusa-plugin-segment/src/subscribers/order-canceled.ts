export default async function handler({ data: { id }, container }) {
  const orderService = container.resolve("orderService")
  const segmentService = container.resolve("segmentService")

  const order = await orderService.retrieveWithTotals(id)

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
