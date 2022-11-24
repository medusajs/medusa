import { PostgresError } from "@medusajs/medusa/dist/utils"

export default async (req, res) => {
  const signature = req.headers["stripe-signature"]

  let event
  try {
    const stripeProviderService = req.scope.resolve("pp_stripe")
    event = stripeProviderService.constructWebhookEvent(req.body, signature)
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  function isPaymentCollection(id) {
    return id && id.startsWith("paycol")
  }

  async function handleCartPayments(event, req, res, cartId) {
    const manager = req.scope.resolve("manager")
    const orderService = req.scope.resolve("orderService")

    const order = await orderService
      .retrieveByCartId(cartId)
      .catch(() => undefined)

    // handle payment intent events
    switch (event.type) {
      case "payment_intent.succeeded":
        if (order && order.payment_status !== "captured") {
          await manager.transaction(async (manager) => {
            await orderService.withTransaction(manager).capturePayment(order.id)
          })
        }
        break
      case "payment_intent.amount_capturable_updated":
        try {
          await manager.transaction(async (manager) => {
            await paymentIntentAmountCapturableEventHandler({
              order,
              cartId,
              container: req.scope,
              transactionManager: manager,
            })
          })
        } catch (err) {
          let message = `Stripe webhook ${event} handling failed\n${
            err?.detail ?? err?.message
          }`
          if (err?.code === PostgresError.SERIALIZATION_FAILURE) {
            message = `Stripe webhook ${event} handle failed. This can happen when this webhook is triggered during a cart completion and can be ignored. This event should be retried automatically.\n${
              err?.detail ?? err?.message
            }`
          }
          this.logger_.warn(message)
          return res.sendStatus(409)
        }
        break
      default:
        res.sendStatus(204)
        return
    }

    res.sendStatus(200)
  }

  async function handlePaymentCollection(event, req, res, id, paymentIntentId) {
    const manager = req.scope.resolve("manager")
    const paymentCollectionService = req.scope.resolve(
      "paymentCollectionService"
    )

    const paycol = await paymentCollectionService
      .retrieve(id, { relations: ["payments"] })
      .catch(() => undefined)

    if (paycol?.payments?.length) {
      if (event.type === "payment_intent.succeeded") {
        const payment = paycol.payments.find(
          (pay) => pay.data.id === paymentIntentId
        )
        if (payment && !payment.captured_at) {
          await manager.transaction(async (manager) => {
            await paymentCollectionService
              .withTransaction(manager)
              .capture(payment.id)
          })
        }

        res.sendStatus(200)
        return
      }
    }
    res.sendStatus(204)
  }

  const paymentIntent = event.data.object
  const cartId = paymentIntent.metadata.cart_id // Backward compatibility
  const resourceId = paymentIntent.metadata.resource_id

  if (isPaymentCollection(resourceId)) {
    await handlePaymentCollection(event, req, res, resourceId, paymentIntent.id)
  } else {
    await handleCartPayments(event, req, res, cartId ?? resourceId)
  }
}

async function paymentIntentAmountCapturableEventHandler({
  order,
  cartId,
  container,
  transactionManager,
}) {
  if (!order) {
    const cartService = container.resolve("cartService")
    const orderService = container.resolve("orderService")

    const cartServiceTx = cartService.withTransaction(transactionManager)
    await cartServiceTx.setPaymentSession(cartId, "stripe")
    await cartServiceTx.authorizePayment(cartId)
    await orderService
      .withTransaction(transactionManager)
      .createFromCart(cartId)
  }
}
