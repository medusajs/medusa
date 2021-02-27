class OrderSubscriber {
  constructor({
    segmentService,
    eventBusService,
    orderService,
    claimService,
    returnService,
    fulfillmentService,
  }) {
    this.orderService_ = orderService

    this.returnService_ = returnService

    this.claimService_ = claimService
    this.fulfillmentService_ = fulfillmentService

    eventBusService.subscribe(
      "order.shipment_created",
      async ({ id, fulfillment_id }) => {
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
            "items",
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

        const fulfillment = await this.fulfillmentService_.retrieve(
          fulfillment_id,
          {
            relations: ["items"],
          }
        )

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
    )

    eventBusService.subscribe("claim.created", async ({ id }) => {
      const claim = await this.claimService_.retrieve(id, {
        relations: [
          "order",
          "claim_items",
          "claim_items.item",
          "claim_items.tags",
          "claim_items.variant",
        ],
      })

      for (const ci of claim.claim_items) {
        const price = ci.item.unit_price / 100
        const reporting_price = await segmentService.getReportingValue(
          claim.order.currency_code,
          price
        )
        const event = {
          event: "Item Claimed",
          userId: claim.order.customer_id,
          timestamp: claim.created_at,
          properties: {
            price,
            reporting_price,
            order_id: claim.order_id,
            claim_id: claim.id,
            claim_item_id: ci.id,
            type: claim.type,
            quantity: ci.quantity,
            variant: ci.variant.sku,
            product_id: ci.variant.product_id,
            reason: ci.reason,
            note: ci.note,
            tags: ci.tags.map((t) => ({ id: t.id, value: t.value })),
          },
        }
        await segmentService.track(event)
      }
    })

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
            "items",
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
          "items",
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

      const orderData = await segmentService.buildOrder(order)
      const orderEvent = {
        event: "Order Completed",
        userId: order.customer_id,
        properties: orderData,
        timestamp: order.created_at,
      }

      segmentService.track(orderEvent)
    })
  }
}

export default OrderSubscriber
