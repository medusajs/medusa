import { Request, Response } from "express"
import { constructWebhook, handlePaymentHook } from "../utils/utils"

export default async (req: Request, res: Response) => {
  let event
  try {
    event = constructWebhook({
      signature: req.headers["stripe-signature"],
      body: req.body,
      container: req.scope,
    })
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  const paymentIntent = event.data.object

  const { statusCode } = await handlePaymentHook({
    event,
    container: req.scope,
    paymentIntent,
  })
  res.sendStatus(statusCode)
}
