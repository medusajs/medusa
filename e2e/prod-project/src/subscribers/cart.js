class CartSubscriber {
  constructor({ cartService, eventBusService }) {
    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("cart.created", this.log)
    this.eventBus_.subscribe("cart.updated", this.log)
  }

  async log(c) {
    console.log(c)
  }
}

export default CartSubscriber
