class OrderSubscriber {
  constructor({ notificationService }) {
    this.notificationService_ = notificationService

    this.notificationService_.subscribe("order.shipment_created", "sendgrid")
    this.notificationService_.subscribe("order.gift_card_created", "sendgrid")
    this.notificationService_.subscribe("gift_card.created", "sendgrid")
    this.notificationService_.subscribe("order.placed", "sendgrid")
    this.notificationService_.subscribe("order.canceled", "sendgrid")
    this.notificationService_.subscribe("customer.password_reset", "sendgrid")
    this.notificationService_.subscribe("claim.shipment_created", "sendgrid")
    this.notificationService_.subscribe("swap.shipment_created", "sendgrid")
    this.notificationService_.subscribe("swap.created", "sendgrid")
    this.notificationService_.subscribe("order.items_returned", "sendgrid")
    this.notificationService_.subscribe("order.return_requested", "sendgrid")
    this.notificationService_.subscribe("order.refund_created", "sendgrid")
  }
}

export default OrderSubscriber
