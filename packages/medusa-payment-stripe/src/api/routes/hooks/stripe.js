import { PostgresError } from "@medusajs/medusa"

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
    const logger = req.scope.resolve("logger")
    const cartService = req.scope.resolve("cartService")
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
        if (!order) {
          const err = await manager
            .transaction(async (manager) => {
              const cartServiceTx = cartService.withTransaction(manager)
              await cartServiceTx.setPaymentSession(cartId, "stripe")
              await cartServiceTx.authorizePayment(cartId)
              await orderService.withTransaction(manager).createFromCart(cartId)
            })
            .catch((e) => {
              return e
            })

          if (err) {
            let message = `Stripe webhook payment_intent.amount_capturable_updated handling failed\n${
              err?.detail ?? err?.message
            }`
            if (err.code === PostgresError.SERIALIZATION_FAILURE) {
              message = `Stripe webhook payment_intent.amount_capturable_updated handle failed. This can happen when this webhook is triggered during a cart completion and can be ignored. This event should be retried automatically.\n${
                err?.detail ?? err?.message
              }`
            }
            logger.warning(message)
            res.sendStatus(400).send(message)
            return
          }
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
    await handlePaymentCollection(event, req, res, resourceId, paymentIntentId)
  } else {
    await handleCartPayments(event, req, res, cartId ?? resourceId)
  }
}
