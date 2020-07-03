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

  // handle payment intent events
  switch (event.type) {
    case "payment_intent.succeeded":
      break
    case "payment_intent.canceled":
      break
    case "payment_intent.created":
      break
    case "payment_intent.payment_failed":
      break
    case "payment_intent.amount_capturable_updated":
      break
    case "payment_intent.processing":
      break
    default:
      res.status(400)
      return
  }

  res.sendStatus(200)
}
