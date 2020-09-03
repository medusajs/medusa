class OrderSubscriber {
  constructor({
    totalsService,
    orderService,
    sendgridService,
    eventBusService,
  }) {
    this.orderService_ = orderService
    this.totalsService_ = totalsService
    this.sendgridService_ = sendgridService
    this.eventBus_ = eventBusService

    this.eventBus_.subscribe(
      "order.shipment_created",
      async ({ order_id, shipment }) => {
        const order = await this.orderService_.retrieve(order_id)
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

    this.eventBus_.subscribe("order.placed", async (order) => {
      const subtotal = await this.totalsService_.getSubtotal(order)
      const tax_total = await this.totalsService_.getTaxTotal(order)
      const discount_total = await this.totalsService_.getDiscountTotal(order)
      const shipping_total = await this.totalsService_.getShippingTotal(order)
      const total = await this.totalsService_.getTotal(order)

      const date = new Date(parseInt(order.created))
      const data = {
        ...order,
        date: date.toDateString(),
        items: order.items.map((i) => {
          return {
            ...i,
            price: `${(i.content.unit_price * (1 + order.tax_rate)).toFixed(
              2
            )} ${order.currency_code}`,
          }
        }),
        discounts: order.discounts.map((discount) => {
          return {
            is_giftcard: discount.is_giftcard,
            code: discount.code,
            descriptor: `${discount.discount_rule.value}${
              discount.discount_rule.type === "percentage"
                ? "%"
                : ` ${order.currency_code}`
            }`,
          }
        }),
        subtotal: `${(subtotal * (1 + order.tax_rate)).toFixed(2)} ${
          order.currency_code
        }`,
        tax_total: `${tax_total.toFixed(2)} ${order.currency_code}`,
        discount_total: `${(discount_total * (1 + order.tax_rate)).toFixed(
          2
        )} ${order.currency_code}`,
        shipping_total: `${(shipping_total * (1 + order.tax_rate)).toFixed(
          2
        )} ${order.currency_code}`,
        total: `${total.toFixed(2)} ${order.currency_code}`,
      }

      await this.sendgridService_.transactionalEmail("order.placed", data)
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
