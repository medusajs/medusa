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

  async handleFailedAuthorization_(notification) {
    const cartId = notification.additionalData["metadata.cart_id"]
    // We need to ensure, that an order is created in situations, where the
    // customer might have closed their browser prior to order creation
    let cart = await this.cartService_.retrieve(cartId)

    const { payment_method } = cart

    payment_method.data = {
      ...payment_method.data,
      pspReference: notification.pspReference,
      resultCode: "Failed",
    }

    await this.cartService_.setPaymentMethod(cart._id, payment_method)
  }

  async handleAuthorization_(notification) {
    const cartId = notification.additionalData["metadata.cart_id"]
    // We need to ensure, that an order is created in situations, where the
    // customer might have closed their browser prior to order creation
    try {
      const order = await this.orderService_.retrieveByCartId(cartId)

      const paymentMethod = order.payment_method

      paymentMethod.data = {
        ...paymentMethod.data,
        pspReference: notification.pspReference,
        resultCode: "Authorised",
      }

      await this.orderService_.update(order._id, {
        payment_method: paymentMethod,
      })
    } catch (error) {
      let cart = await this.cartService_.retrieve(cartId)

      const { payment_method } = cart

      payment_method.data = {
        ...payment_method.data,
        pspReference: notification.pspReference,
        resultCode: "Authorised",
      }

      await this.cartService_.setPaymentMethod(cart._id, payment_method)

      const toCreate = await this.cartService_.retrieve(cart._id)

      await this.orderService_.createFromCart(toCreate)
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
