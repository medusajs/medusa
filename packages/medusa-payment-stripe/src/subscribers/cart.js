class CartSubscriber {
  constructor({ cartService, eventBusService }) {
    this.cartService_ = cartService
    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("cart.created", (data) => {
      console.log(data)
    })
  }
}

export default CartSubscriber
