class CartSubscriber {
  constructor({
    cartService,
    customerService,
    stripeProviderService,
    eventBusService,
  }) {
    /** @private @const {CartService} */
    this.cartService_ = cartService

    /** @private @const {CustomerService} */
    this.customerService_ = customerService

    /** @private @const {StripeProviderService} */
    this.stripeProviderService_ = stripeProviderService

    /** @private @const {EventBusService} */
    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("cart.customer_updated", async (cart) => {
      await this.onCustomerUpdated(cart)
    })
  }

  /**
   * Subscriber function that listens for cart.customer updates.
   * We need to ensure, that the customer on the cart is corresponds
   * with a customer in Stripe.
   * @param {Object} cart - cart on which customer is updated
   * @returns {Promise} empty promise
   */
  async onCustomerUpdated(cart) {
    const { customer_id, payment_sessions } = cart

    if (!payment_sessions.length) {
      return Promise.resolve()
    }

    const customer = await this.customerService_.retrieve(customer_id)

    const stripeSession = payment_sessions.find(
      (s) => s.provider_id === "stripe"
    )

    if (!stripeSession) {
      return Promise.resolve()
    }

    const paymentIntent = await this.stripeProviderService_.retrievePayment(
      stripeSession.data
    )

    let stripeCustomer

    // If customer is already registered with Stripe, we fetch that customer
    if (customer.metadata?.stripe_id) {
      stripeCustomer = await this.stripeProviderService_.retrieveCustomer(
        customer.metadata.stripe_id
      )
    }

    // Else, we create a customer at Stripe
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
        paymentIntent.id,
        stripeCustomer.id
      )
    }

    if (stripeCustomer.id !== paymentIntent.customer) {
      await this.stripeProviderService_.cancelPayment(paymentIntent)
      const newPaymentIntent = await this.stripeProviderService_.createPayment(
        cart
      )

      await this.cartService_.updatePaymentSession(
        cart.id,
        "stripe",
        newPaymentIntent
      )
    }

    return Promise.resolve()
  }
}

export default CartSubscriber
