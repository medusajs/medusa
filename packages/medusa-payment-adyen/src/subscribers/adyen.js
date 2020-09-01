class AdyenSubscriber {
  constructor({ cartService, orderService, eventBusService }) {
    this.cartService_ = cartService

    this.orderService_ = orderService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe(
      "adyen.notification_received",
      async (notification) => this.handleAdyenNotification(notification)
    )
  }

  async handleAdyenNotification(notification) {
    if (
      notification.success === "true" &&
      notification.eventCode === "AUTHORISATION"
    ) {
      const cartId = notification.additionalData["metadata.cart_id"]

      // We need to ensure, that an order is created in situations, where the
      // customer might have closed their browser prior to order creation
      try {
        const order = await this.orderService_.retrieveByCartId(cartId)

        const paymentMethod = order.payment_method
        paymentMethod.data = paymentSession.data = this.handlePaymentSessionUpdate_(
          paymentSession.data,
          notification
        )

        await this.orderService_.update(order._id, {
          payment_method: paymentMethod,
        })
      } catch (error) {
        let cart = await this.cartService_.retrieve(cartId)

        const paymentSession = await this.cartService_.retrievePaymentSession(
          cart._id,
          cart.payment_method.provider_id
        )

        paymentSession.data = this.handlePaymentSessionUpdate_(
          paymentSession.data,
          notification
        )

        await this.cartService_.updatePaymentSession(
          cart._id,
          cart.payment_method.provider_id,
          paymentSession
        )

        await this.orderService_.createFromCart(cart)
      }
    }

    if (
      notification.success === "false" &&
      notification.eventCode === "CAPTURE"
    ) {
      this.eventBus_.emit("adyen.capture_failed", notification)
    }
  }

  handlePaymentSessionUpdate_(sessionData, update) {
    return {
      ...sessionData,
      amount: update.amount,
      pspReference: update.pspReference,
      additionalData: {
        cardSummary: update.additionalData.cardSummary,
      },
    }
  }
}

export default AdyenSubscriber
