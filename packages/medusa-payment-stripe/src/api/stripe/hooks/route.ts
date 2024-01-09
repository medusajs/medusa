import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { constructWebhook } from "../../utils/utils"
import StripeProviderService from "../../../services/stripe-provider"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const pluginOptions = req.scope.resolve<StripeProviderService>(
      "stripeProviderService"
    ).options

    const event = constructWebhook({
      signature: req.headers["stripe-signature"],
      body: req.body,
      container: req.scope,
    })

    const eventBus = req.scope.resolve("eventBusService")

    // we delay the processing of the event to avoid a conflict caused by a race condition
    await eventBus.emit("medusa.stripe_payment_intent_update", event, {
      delay: pluginOptions.webhook_delay || 5000,
      attempts: pluginOptions.webhook_retries || 3,
    })
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  res.sendStatus(200)
}
