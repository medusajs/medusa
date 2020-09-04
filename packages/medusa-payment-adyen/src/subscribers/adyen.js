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
    console.log(notification)
    switch (true) {
      // DISCUSS THIS RACE CONDITION
      // case notification.success === "true" &&
      //   notification.eventCode === "AUTHORISATION": {
      //   this.handleAuthorization(notification)
      //   break
      // }
      case notification.success === "true" &&
        notification.eventCode === "CAPTURE": {
        this.handleCapture_(notification)
        break
      }
      case notification.success === "true" &&
        notification.eventCode === "CAPTURE_FAILED": {
        this.handleFailedCapture_(notification)
        break
      }
      case notification.success === "true" &&
        notification.eventCode === "REFUND": {
        this.handleRefund_(notification)
        break
      }
      case notification.success === "false" &&
        notification.eventCode === "REFUND": {
        this.handleFailedRefund_(notification)
        break
      }
      case notification.success === "false" &&
        notification.eventCode === "CAPTURE": {
        this.handleFailedCapture_(notification)
        break
      }
      default:
        break
    }
  }

  async handleAuthorization(notification) {
    const cartId = notification.additionalData["metadata.cart_id"]
    // We need to ensure, that an order is created in situations, where the
    // customer might have closed their browser prior to order creation
    try {
      await this.orderService_.retrieveByCartId(cartId)
    } catch (error) {
      let cart = await this.cartService_.retrieve(cartId)

      const paymentSession = await this.cartService_.retrievePaymentSession(
        cart._id,
        cart.payment_method.provider_id
      )

      paymentSession.data = {
        ...paymentSession.data,
        status: notification.eventCode,
        pspReference: notification.pspReference,
        amount: notification.amount,
        additionalData: notification.additionalData,
      }

      await this.cartService_.updatePaymentSession(
        cart._id,
        cart.payment_method.provider_id,
        paymentSession
      )

      await this.orderService_.createFromCart(cart)
    }
  }

  async handleCapture_(notification) {
    const cartId = notification.additionalData["metadata.cart_id"]

    const order = await this.orderService_.retrieveByCartId(cartId)

    await this.orderService_.registerPaymentCapture(order._id)

    const paymentMethod = order.payment_method

    paymentMethod.data = this.getUpdatedPaymentMethod_(
      paymentMethod.data,
      notification
    )

    await this.orderService_.update(order._id, {
      payment_method: paymentMethod,
    })
  }

  async handleFailedCapture_(notification) {
    const cartId = notification.additionalData["metadata.cart_id"]

    const order = await this.orderService_.retrieveByCartId(cartId)

    await this.orderService_.registerPaymentFailed(
      order._id,
      notification.reason
    )

    const paymentMethod = order.payment_method

    paymentMethod.data = this.getUpdatedPaymentMethod_(
      paymentMethod.data,
      notification
    )

    await this.orderService_.update(order._id, {
      payment_method: paymentMethod,
    })
  }

  async handleFailedRefund_(notification) {
    const cartId = notification.additionalData["metadata.cart_id"]

    const order = await this.orderService_.retrieveByCartId(cartId)

    await this.orderService_.registerRefundFailed(
      order._id,
      notification.reason
    )

    const paymentMethod = order.payment_method

    paymentMethod.data = this.getUpdatedPaymentMethod_(
      paymentMethod.data,
      notification
    )

    await this.orderService_.update(order._id, {
      payment_method: paymentMethod,
    })
  }

  async handleRefund_(notification) {
    const cartId = notification.additionalData["metadata.cart_id"]

    const order = await this.orderService_.retrieveByCartId(cartId)

    await this.orderService_.registerRefund(order._id)

    const paymentMethod = order.payment_method

    paymentMethod.data = this.getUpdatedPaymentMethod_(
      paymentMethod.data,
      notification
    )

    await this.orderService_.update(order._id, {
      payment_method: paymentMethod,
    })
  }

  getUpdatedPaymentMethod_(sessionData, update) {
    return {
      ...sessionData,
      status: update.eventCode,
      pspReference: update.pspReference,
      originalReference: update.originalReference,
    }
  }
}

export default AdyenSubscriber
