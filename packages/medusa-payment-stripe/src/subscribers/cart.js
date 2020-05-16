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
    const { customer_id, payment_method } = cart
    const customer = await this.customerService_.retrieve(customer_id)

    if (customer.metadata.stripe_id === payment_method.data.customer) {
      return Promise.resolve()
    }

    if (customer.metadata.stripe_id !== payment_method.data.customer) {
      if (!payment_method) {
        const paymentIntent = await this.stripeProviderService_.createPayment(
          cart
        )
        await this.cartService_.updatePaymentMethod(
          cart._id,
          payment_method.provider_id,
          paymentIntent
        )
      } else {
        const { id } = payment_method.data
        await this.stripeProviderService_.updatePayment(id, {
          customer: customer.metadata.stripe_id,
        })
      }
    }
    return Promise.resolve()
  }
}

export default CartSubscriber
