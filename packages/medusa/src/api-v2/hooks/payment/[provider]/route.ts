import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { provider } = req.params

    const options = req.scope.resolve(ModuleRegistrationName.PAYMENT).options

    const event = { provider, data: req.body }

    const eventBus = req.scope.resolve("eventBusService")

    // we delay the processing of the event to avoid a conflict caused by a race condition
    await eventBus.emit("payment.webhook_received", event, {
      delay: options.webhook_delay || 5000,
      attempts: options.webhook_retries || 3,
    })
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  res.sendStatus(200)
}
