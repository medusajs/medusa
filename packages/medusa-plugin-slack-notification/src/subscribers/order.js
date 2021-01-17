class OrderSubscriber {
  constructor({ slackService, eventBusService }) {
    this.slackService_ = slackService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("order.placed", async ({ id }) => {
      await this.slackService_.orderNotification(id)
    })
  }
}

export default OrderSubscriber
