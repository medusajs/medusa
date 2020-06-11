class OrderSubscriber {
  constructor({ sendgridService, eventBusService }) {
    this.sendgridService_ = sendgridService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("order.placed", async (order) => {
      await this.sendgridService_.sendEmail("order.placed", order)
    })

    this.eventBus_.subscribe("order.cancelled", async (order) => {
      await this.sendgridService_.sendEmail("order.cancelled", order)
    })

    this.eventBus_.subscribe("order.updated", async (order) => {
      await this.sendgridService_.sendEmail("order.updated", order)
    })
  }
}

export default OrderSubscriber
