class CartSubscriber {
  constructor({
    cartService,
    customerService,
    paymentProviderService,
    eventBusService,
  }) {
    this.cartService_ = cartService
    this.customerService_ = customerService
    this.paymentProviderService_ = paymentProviderService
    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("cart.customer_updated", async (cart) => {
      await this.onCustomerUpdated(cart)
    })
  }

  async onCustomerUpdated(cartId) {
    const cart = await this.cartService_.retrieve(cartId, {
      relations: ["payment_sessions", "customer"],
    })

    if (!cart.payment_sessions?.length) {
      return Promise.resolve()
    }

    const session = cart.payment_sessions.find(
      (ps) => ps.provider_id === "stripe"
    )

    if (session) {
      return this.paymentProviderService_.updateSession(session, cart)
    }
  }
}

export default CartSubscriber
