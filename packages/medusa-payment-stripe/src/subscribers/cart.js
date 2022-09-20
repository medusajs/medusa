class CartSubscriber {
  constructor({
    manager,
    cartService,
    paymentProviderService,
    eventBusService,
  }) {
    this.cartService_ = cartService
    this.paymentProviderService_ = paymentProviderService
    this.eventBus_ = eventBusService
    this.manager_ = manager

    this.eventBus_.subscribe("cart.customer_updated", async (cart) => {
      await this.onCustomerUpdated(cart)
    })
  }

  async onCustomerUpdated(cartId) {
    await this.manager_.transaction(async (transactionManager) => {
      const cart = await this.cartService_
        .withTransaction(transactionManager)
        .retrieve(cartId, {
          select: [
            "subtotal",
            "tax_total",
            "shipping_total",
            "discount_total",
            "gift_card_total",
            "total",
          ],
          relations: [
            "billing_address",
            "shipping_address",
            "region",
            "region.payment_providers",
            "items",
            "items.adjustments",
            "payment_sessions",
            "customer",
          ],
        })

      if (!cart.payment_sessions?.length) {
        return Promise.resolve()
      }

      const session = cart.payment_sessions.find(
        (ps) => ps.provider_id === "stripe"
      )

      if (session) {
        return await this.paymentProviderService_
          .withTransaction(transactionManager)
          .updateSession(session, cart)
      }
    })
  }
}

export default CartSubscriber
