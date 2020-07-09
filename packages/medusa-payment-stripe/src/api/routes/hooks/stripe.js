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

  const orderService = req.scope.resolve("orderService")

  // handle payment intent events
  switch (event.type) {
    case "payment_intent.succeeded":
      const cartId = paymentIntent.metadata.cart_id
      const order = await orderService.retrieveByCartId(cartId)

      await orderService.update(order._id, {
        payment_status: "captured",
      })
      break
    case "payment_intent.cancelled":
      const cartId = paymentIntent.metadata.cart_id
      const order = await orderService.retrieveByCartId(cartId)

      await orderService.update(order._id, {
        status: "cancelled",
      })
      break
    case "payment_intent.payment_failed":
      // TODO: Not implemented yet
      break
    case "payment_intent.amount_capturable_updated":
      // TODO: Not implemented yet
      break
    default:
      res.status(400)
      return
  }

  res.sendStatus(200)
}
