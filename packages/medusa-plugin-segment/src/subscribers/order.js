class OrderSubscriber {
  constructor({ segmentService, eventBusService }) {
    eventBusService.subscribe("order.placed", async (order) => {
      const date = new Date(parseInt(order.created))
      const orderData = await segmentService.buildOrder(order)
      const orderEvent = {
        event: "Order Completed",
        userId: order.customer_id,
        properties: orderData,
        timestamp: date,
      }

      segmentService.track(orderEvent)
    })
  }
}

export default OrderSubscriber
