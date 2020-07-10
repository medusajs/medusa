class OrderSubscriber {
  constructor({ klarnaProviderService, eventBusService }) {
    this.klarnaProviderService_ = klarnaProviderService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("order.completed", async (order) => {
      const klarnaOrderId = order.payment_method.data.id
      await this.klarnaProviderService_.acknowledgeOrder(klarnaOrderId)
    })
  }
}

export default OrderSubscriber
