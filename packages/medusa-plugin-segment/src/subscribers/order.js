class OrderSubscriber {
  constructor({
    segmentService,
    eventBusService,
    orderService,
    returnService,
  }) {
    this.orderService_ = orderService

    this.returnService_ = returnService

    eventBusService.subscribe(
      "order.items_returned",
      async ({ id, return_id }) => {
        const order = await this.orderService_.retrieve(id, {
          select: [
            "shipping_total",
            "discount_total",
            "tax_total",
            "refunded_total",
            "gift_card_total",
            "subtotal",
            "total",
          ],
          relations: [
            "customer",
            "billing_address",
            "shipping_address",
            "discounts",
            "shipping_methods",
            "payments",
            "fulfillments",
            "returns",
            "gift_cards",
            "gift_card_transactions",
            "swaps",
            "swaps.return_order",
            "swaps.payment",
            "swaps.shipping_methods",
            "swaps.shipping_address",
            "swaps.additional_items",
            "swaps.fulfillments",
          ],
        })

        const ret = await this.returnService_.retrieve(return_id)

        const shipping = []
        if (ret.shipping_method && ret.shipping_method.price) {
          shipping.push({
            ...ret.shipping_method,
            price: -1 * (ret.shipping_method.price / 100),
          })
        }

        const toBuildFrom = {
          ...order,
          shipping_methods: shipping,
          items: ret.items.map((i) =>
            order.items.find((l) => l.id === i.item_id)
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

    eventBusService.subscribe("order.canceled", async ({ id }) => {
      const order = await this.orderService_.retrieve(id, {
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
    })

    eventBusService.subscribe("order.placed", async ({ id }) => {
      const order = await this.orderService_.retrieve(id, {
        select: [
          "shipping_total",
          "discount_total",
          "tax_total",
          "refunded_total",
          "gift_card_total",
          "subtotal",
          "total",
        ],
        relations: [
          "customer",
          "billing_address",
          "shipping_address",
          "discounts",
          "shipping_methods",
          "payments",
          "fulfillments",
          "returns",
          "gift_cards",
          "gift_card_transactions",
          "swaps",
          "swaps.return_order",
          "swaps.payment",
          "swaps.shipping_methods",
          "swaps.shipping_address",
          "swaps.additional_items",
          "swaps.fulfillments",
        ],
      })

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
