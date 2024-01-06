import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { constructWebhook } from "../../utils/utils"

const WEBHOOK_DELAY = process.env.STRIPE_WEBHOOK_DELAY ?? 5000 // 5s
const WEBHOOK_RETRIES = process.env.STRIPE_WEBHOOK_RETRIES ?? 3

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const event = constructWebhook({
      signature: req.headers["stripe-signature"],
      body: req.body,
      container: req.scope,
    })

    const eventBus = req.scope.resolve("eventBusService")

    // we delay the processing of the event to avoid a conflict caused by a race condition
    await eventBus.emit("medusa.stripe_payment_intent_update", event, {
      delay: WEBHOOK_DELAY,
      attempts: WEBHOOK_RETRIES,
    })
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  res.sendStatus(200)
}
