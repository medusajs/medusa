class OrderSubscriber {
  constructor({ paymentProviderService, eventBusService }) {
    this.paymentProviderService_ = paymentProviderService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("order.completed", async order => {
      const paymentProvider = this.paymentProviderService_.retrieveProvider(
        order.payment_method.provider_id
      )

      await paymentProvider.capturePayment(order._id)
    })
  }
}

export default OrderSubscriber
