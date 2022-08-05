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

  const paymentIntent = event.data.object

  const cartService = req.scope.resolve("cartService")
  const orderService = req.scope.resolve("orderService")

  const cartId = paymentIntent.metadata.cart_id
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
    //case "payment_intent.canceled":
    //  if (order) {
    //    await orderService.update(order._id, {
    //      status: "canceled",
    //    })
    //  }
    //  break
    case "payment_intent.payment_failed":
      // TODO: Not implemented yet
      break
    case "payment_intent.amount_capturable_updated":
      if (!order) {
        await manager.transaction(async (manager) => {
          await cartService.withTransaction(manager).setPaymentSession(cartId, "stripe")
          await cartService.withTransaction(manager).authorizePayment(cartId)
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
