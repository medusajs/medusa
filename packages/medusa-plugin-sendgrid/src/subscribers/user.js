class UserSubscriber {
  constructor({ sendgridService, eventBusService }) {
    this.sendgridService_ = sendgridService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("user.password_reset", async (data) => {
      await this.sendgridService_.sendNotification(
        "user.password_reset",
        data,
        null
      )
    })
  }
}

export default UserSubscriber
