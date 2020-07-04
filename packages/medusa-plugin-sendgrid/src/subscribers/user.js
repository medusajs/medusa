class UserSubscriber {
  constructor({ sendgridService, eventBusService }) {
    this.sendgridService_ = sendgridService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("user.password_reset", async (data) => {
      await this.sendgridService_.transactionalEmail(
        "user.password_reset",
        data
      )
    })

    this.eventBus_.subscribe("customer.password_reset", async (data) => {
      await this.sendgridService_.transactionalEmail(
        "customer.password_reset",
        data
      )
    })
  }
}

export default UserSubscriber
