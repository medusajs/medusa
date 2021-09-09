class OrderSubscriber {
  constructor({ economicService, eventBusService }) {
    this.economicService_ = economicService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("order.placed", async (order) => {
      await this.economicService_.draftEconomicInvoice(order.id)
    })

    this.eventBus_.subscribe("order.payment_captured", async (order) => {
      await this.economicService_.bookEconomicInvoice(order.id)
    })
  }
}

export default OrderSubscriber
