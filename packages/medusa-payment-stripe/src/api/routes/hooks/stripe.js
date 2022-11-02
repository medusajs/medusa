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
          await manager.transaction(async (manager) => {
            const cartServiceTx = cartService.withTransaction(manager)
            await cartServiceTx.setPaymentSession(cartId, "stripe")
            await cartServiceTx.authorizePayment(cartId)
            await orderService.withTransaction(manager).createFromCart(cartId)
          })
        }
        break
      default:
        res.sendStatus(204)
        return
    }

    res.sendStatus(200)
  }

  const paymentIntent = event.data.object
  const cartId = paymentIntent.metadata.cart_id
  const resourceId = paymentIntent.metadata.resource_id

  if (isPaymentCollection(resourceId)) {
    // TODO: handle payment collection
  } else {
    await handleCartPayments(event, req, res, resourceId ?? cartId)
  }
}
