import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { PaymentWebhookEvents } from "@medusajs/utils"
import { PaymentModuleOptions } from "@medusajs/types"

import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { provider } = req.params

    const options: PaymentModuleOptions =
      req.scope.resolve(ModuleRegistrationName.PAYMENT).options || {}

    const event = {
      provider,
      payload: { data: req.body, rawData: req.rawBody, headers: req.headers },
    }

    const eventBus = req.scope.resolve(ModuleRegistrationName.EVENT_BUS)

    // we delay the processing of the event to avoid a conflict caused by a race condition
    await eventBus.emit(PaymentWebhookEvents.WebhookReceived, event, {
      delay: options.webhook_delay || 5000,
      attempts: options.webhook_retries || 3,
    })
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  res.sendStatus(200)
}
