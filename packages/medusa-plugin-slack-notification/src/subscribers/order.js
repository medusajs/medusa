class OrderSubscriber {
  constructor({ slackService, eventBusService }) {
    this.slackService_ = slackService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("order.placed", async (order) => {
      await this.slackService_.orderNotification(order._id)
    })
  }
}

export default OrderSubscriber
