class OrderSubscriber {
  constructor({
    paymentProviderService,
    cartService,
    customerService,
    eventBusService,
  }) {
    this.paymentProviderService_ = paymentProviderService
    this.customerService_ = customerService
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
      await this.customerService_.addAddress(
        order.customer_id,
        order.shipping_address
      )
    })

    this.eventBus_.subscribe("order.placed", async order => {
      await this.cartService_.delete(order.cart_id)
    })
  }
}

export default OrderSubscriber
