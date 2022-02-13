class AdyenSubscriber {
  constructor(container) {
    /** @private @const {CartService} */
    this.cartService_ = container.cartService

    /** @private @const {OrderService} */
    this.orderService_ = container.orderService

    /** @private @const {EventBusService} */
    this.eventBus_ = container.eventBusService

    /** @private @const {PaymentRepository} */
    this.paymentRepository_ = container.paymentRepository

    this.manager_ = container.manager

    this.eventBus_.subscribe(
      "adyen.notification_received",
      async (notification) => this.handleAdyenNotification(notification)
    )
  }

  /**
   * Webhook handler for Adyen payment.
   * @param {object} notification - webhook notification object
   * @return {string} the status of the payment intent
   */
  async handleAdyenNotification(notification) {
    switch (true) {
      case notification.success === "true" &&
        notification.eventCode === "AUTHORISATION": {
        this.handleAuthorization_(notification)
        break
      }
      case notification.success === "false" &&
        notification.eventCode === "AUTHORISATION": {
        this.handleFailedAuthorization_(notification)
        break
      }
      case notification.success === "true" &&
        notification.eventCode === "CAPTURE_FAILED": {
        this.handleFailedCapture_(notification)
        break
      }
      case notification.success === "false" &&
        notification.eventCode === "CAPTURE": {
        this.handleFailedCapture_(notification)
        break
      }
      case notification.success === "false" &&
        notification.eventCode === "REFUND": {
        this.handleFailedRefund_(notification)
        break
      }
      default:
        break
    }
  }

  async handleFailedAuthorization_(notification) {
    const cartId = notification.additionalData["metadata.cart_id"]
    const cart = await this.cartService_.retrieve(cartId, {
      relations: ["payment_sessions"],
    })

    const { payment_session } = cart

    const updated = {
      ...payment_session,
      status: "error",
      data: {
        ...payment_session.data,
        pspReference: notification.pspReference,
      },
    }

    await this.cartService_.updatePaymentSession(cart.id, updated)
  }

  async handleAuthorization_(notification) {
    const cartId = notification.additionalData["metadata.cart_id"]
    const paymentRepository = this.manager_.getCustomRepository(
      this.paymentRepository_
    )

    // We need to ensure, that an order is created in situations, where the
    // customer might have closed their browser prior to order creation
    try {
      const orderPayment = await paymentRepository.findOne({
        where: { cart_id: cartId },
      })

      if (!orderPayment) {
        throw new Error("Payment not found")
      }

      const updatedPayment = {
        ...orderPayment,
        data: {
          ...orderPayment.data,
          resultCode: "Authorised",
          pspReference: notification.pspReference,
        },
      }

      await this.paymentRepository_.save(updatedPayment)
    } catch (error) {
      await this.manager_.transaction(async (manager) => {
        const session = {
          pspReference: notification.pspReference,
          resultCode: "Authorised",
        }

        await this.cartService_
          .withTransaction(manager)
          .updatePaymentSession(cartId, session)

        await this.cartService_
          .withTransaction(manager)
          .authorizePayment(cartId)

        await this.orderService_.withTransaction(manager).createFromCart(cartId)
      })
    }
  }

  async handleFailedCapture_(notification) {
    const cartId = notification.additionalData["metadata.cart_id"]

    const order = await this.orderService_.retrieveByCartId(cartId)

    await this.orderService_.update(order.id, {
      payment_status: "requires_action",
    })

    await this.eventBus_.emit("order.payment_capture_failed", {
      order,
      error: new Error(`Adyen payment capture: ${notification.reason}`),
    })
  }

  async handleFailedRefund_(notification) {
    const cartId = notification.additionalData["metadata.cart_id"]

    const order = await this.orderService_.retrieveByCartId(cartId)

    await this.orderService_.update(order.id, {
      payment_status: "requires_action",
    })

    await this.eventBus_.emit("order.refund_failed", {
      order,
      error: new Error(`Adyen payment capture: ${notification.reason}`),
    })
  }
}

export default AdyenSubscriber
