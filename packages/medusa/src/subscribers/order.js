class OrderSubscriber {
  constructor({
    paymentProviderService,
    cartService,
    customerService,
    eventBusService,
    discountService,
    totalsService,
  }) {
    this.totalsService_ = totalsService

    this.paymentProviderService_ = paymentProviderService

    this.customerService_ = customerService

    this.discountService_ = discountService

    this.cartService_ = cartService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("order.completed", async order => {
      const paymentProvider = this.paymentProviderService_.retrieveProvider(
        order.payment_method.provider_id
      )

      await paymentProvider.capturePayment(order._id)
    })

    this.eventBus_.subscribe("order.placed", async order => {
      await this.customerService_.addOrder(order.customer_id, order._id)

      const address = {
        ...order.shipping_address,
      }
      delete address._id

      await this.customerService_.addAddress(order.customer_id, address)
    })

    this.eventBus_.subscribe("order.placed", async order => {
      await this.cartService_.delete(order.cart_id)
    })

    this.eventBus_.subscribe("order.placed", this.handleDiscounts)
  }

  handleDiscounts = async order => {
    await Promise.all(
      order.discounts.map(async d => {
        const subtotal = await this.totalsService_.getSubtotal(order)
        if (d.is_giftcard) {
          const discountRule = {
            ...d.discount_rule,
            value: Math.max(0, d.discount_rule.value - subtotal),
          }

          delete discountRule._id

          return this.discountService_.update(d._id, {
            discount_rule: discountRule,
            usage_count: d.usage_count + 1,
            disabled: discountRule.value === 0,
          })
        } else {
          return this.discountService_.update(d._id, {
            usage_count: d.usage_count + 1,
          })
        }
      })
    )
  }
}

export default OrderSubscriber
