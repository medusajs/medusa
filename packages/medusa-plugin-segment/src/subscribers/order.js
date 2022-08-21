class OrderSubscriber {
  constructor({
    segmentService,
    eventBusService,
    orderService,
    cartService,
    claimService,
    returnService,
    fulfillmentService,
  }) {
    this.orderService_ = orderService

    this.cartService_ = cartService

    this.returnService_ = returnService

    this.claimService_ = claimService

    this.fulfillmentService_ = fulfillmentService

    // Swaps
    // swap.created
    // swap.received
    // swap.shipment_created
    // swap.payment_completed
    // swap.payment_captured
    // swap.refund_processed

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
            "discounts.rule",
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
            "discounts.rule",
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

        const ret = await this.returnService_.retrieve(return_id, {
          relations: ["items", "items.reason"],
        })

        const shipping = []
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
          "discounts.rule",
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

      const eventContext = {}
      const integrations = {}

      if (order.cart_id) {
        try {
          const cart = await this.cartService_.retrieve(order.cart_id, {
            select: ["context"],
          })

          if (cart.context) {
            if (cart.context.ip) {
              eventContext.ip = cart.context.ip
            }

            if (cart.context.user_agent) {
              eventContext.user_agent = cart.context.user_agent
            }

            if (segmentService.options_ && segmentService.options_.use_ga_id) {
              if (cart.context.ga_id) {
                integrations["Google Analytics"] = {
                  clientId: cart.context.ga_id,
                }
              }
            }
          }
        } catch (err) {
          console.log(err)
          console.warn("Failed to gather context for order")
        }
      }

      const orderData = await segmentService.buildOrder(order)
      const orderEvent = {
        event: "Order Completed",
        userId: order.customer_id,
        properties: orderData,
        timestamp: order.created_at,
        context: eventContext,
        integrations,
      }

      segmentService.identify({
        userId: order.customer_id,
        traits: {
          email: order.email,
          firstName: order.shipping_address.first_name,
          lastName: order.shipping_address.last_name,
        },
      })

      segmentService.track(orderEvent)
    })
  }
}

export default OrderSubscriber
