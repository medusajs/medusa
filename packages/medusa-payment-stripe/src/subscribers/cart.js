class CartSubscriber {
  constructor({
    cartService,
    customerService,
    stripeProviderService,
    eventBusService,
  }) {
    this.cartService_ = cartService
    this.customerService_ = customerService
    this.stripeProviderService_ = stripeProviderService
    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("cart.created", (data) => {
      console.log(data)
    })

    this.eventBus_.subscribe("cart.customer_updated", async (cart) => {
      await this.onCustomerUpdated(cart)
    })
  }

  async onCustomerUpdated(cart) {
    const { customer_id, payment_sessions } = cart

    if (!payment_sessions) {
      return Promise.resolve()
    }

    const customer = await this.customerService_.retrieve(customer_id)

    const paymentIntent = await this.stripeProviderService_.retrievePayment(
      cart
    )

    let stripeCustomer = await this.stripeProviderService_.retrieveCustomer(
      customer.metadata.stripe_id
    )

    if (!stripeCustomer) {
      stripeCustomer = await this.stripeProviderService_.createCustomer(
        customer
      )
    }

    if (stripeCustomer.id === paymentIntent.customer) {
      return Promise.resolve()
    }

    if (!paymentIntent.customer) {
      return this.stripeProviderService_.updatePaymentIntentCustomer(
        stripeCustomer.id
      )
    }

    if (stripeCustomer.id !== paymentIntent.customer) {
      await this.stripeProviderService_.cancelPayment(paymentIntent.id)
      const newPaymentIntent = await this.stripeProviderService_.createPayment(
        cart
      )

      await this.cartService_.updatePaymentSession(
        cart._id,
        "stripe",
        newPaymentIntent
      )
    }

    return Promise.resolve()
  }
}

export default CartSubscriber
