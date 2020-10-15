class OrderSubscriber {
  constructor({ segmentService, eventBusService }) {
    eventBusService.subscribe(
      "order.items_returned",
      async ({ order, return: ret }) => {
        const shipping = []
        if (ret.shipping_method && ret.shipping_method.price) {
          shipping.push({
            ...ret.shipping_method,
            price: -1 * ret.shipping_method.price,
          })
        }

        const toBuildFrom = {
          ...order,
          shipping_methods: shipping,
          items: ret.items.map((i) =>
            order.items.find((l) => l._id === i.item_id)
          ),
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
    )

    eventBusService.subscribe("order.canceled", async (order) => {
      const date = new Date()
      const orderData = await segmentService.buildOrder(order)
      const orderEvent = {
        event: "Order Cancelled",
        userId: order.customer_id,
        properties: orderData,
        timestamp: date,
      }

      segmentService.track(orderEvent)
    })

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
