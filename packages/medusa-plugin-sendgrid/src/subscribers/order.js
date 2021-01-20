class OrderSubscriber {
  constructor({
    totalsService,
    orderService,
    sendgridService,
    eventBusService,
    fulfillmentService,
  }) {
    this.orderService_ = orderService
    this.totalsService_ = totalsService
    this.sendgridService_ = sendgridService
    this.eventBus_ = eventBusService
    this.fulfillmentService_ = fulfillmentService

    this.eventBus_.subscribe(
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
            "refundable_amount",
          ],
          relations: [
            "customer",
            "billing_address",
            "shipping_address",
            "discounts",
            "shipping_methods",
            "shipping_methods.shipping_option",
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

        const shipment = await this.fulfillmentService_.retrieve(fulfillment_id)

        const data = {
          ...order,
          tracking_number: shipment.tracking_numbers.join(", "),
        }

        await this.sendgridService_.transactionalEmail(
          "order.shipment_created",
          data
        )
      }
    )

    this.eventBus_.subscribe("order.gift_card_created", async (order) => {
      await this.sendgridService_.transactionalEmail(
        "order.gift_card_created",
        order
      )
    })

    this.eventBus_.subscribe("order.placed", async (orderObj) => {
      try {
        const order = await this.orderService_.retrieve(orderObj.id, {
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
            "shipping_methods.shipping_option",
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

        const {
          subtotal,
          tax_total,
          discount_total,
          shipping_total,
          total,
        } = order

        const taxRate = order.tax_rate / 100
        const currencyCode = order.currency_code.toUpperCase()

        const items = order.items.map((i) => {
          return {
            ...i,
            price: `${((i.unit_price / 100) * (1 + taxRate)).toFixed(
              2
            )} ${currencyCode}`,
          }
        })

        let discounts = []
        if (order.discounts) {
          discounts = order.discounts.map((discount) => {
            return {
              is_giftcard: false,
              code: discount.code,
              descriptor: `${discount.rule.value}${
                discount.rule.type === "percentage" ? "%" : ` ${currencyCode}`
              }`,
            }
          })
        }

        let giftCards = []
        if (order.gift_cards) {
          giftCards = order.gift_cards.map((gc) => {
            return {
              is_giftcard: true,
              code: gc.code,
              descriptor: `${gc.value} ${currencyCode}`,
            }
          })

          discounts.concat(giftCards)
        }

        const data = {
          ...order,
          date: order.created_at.toDateString(),
          items,
          discounts,
          subtotal: `${((subtotal / 100) * (1 + taxRate)).toFixed(
            2
          )} ${currencyCode}`,
          tax_total: `${(tax_total / 100).toFixed(2)} ${currencyCode}`,
          discount_total: `${((discount_total / 100) * (1 + taxRate)).toFixed(
            2
          )} ${currencyCode}`,
          shipping_total: `${((shipping_total / 100) * (1 + taxRate)).toFixed(
            2
          )} ${currencyCode}`,
          total: `${(total / 100).toFixed(2)} ${currencyCode}`,
        }

        await this.sendgridService_.transactionalEmail("order.placed", data)
      } catch (error) {
        console.log(error)
      }
    })

    this.eventBus_.subscribe("order.cancelled", async (order) => {
      await this.sendgridService_.transactionalEmail("order.cancelled", order)
    })

    this.eventBus_.subscribe("order.completed", async (order) => {
      await this.sendgridService_.transactionalEmail("order.completed", order)
    })

    this.eventBus_.subscribe("order.updated", async (order) => {
      await this.sendgridService_.transactionalEmail("order.updated", order)
    })
  }
}

export default OrderSubscriber
