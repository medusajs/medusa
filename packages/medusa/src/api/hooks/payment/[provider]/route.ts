import {
  PaymentModuleOptions,
  ProviderWebhookPayload,
} from "@medusajs/framework/types"
import {
  MedusaError,
  Modules,
  PaymentWebhookEvents,
} from "@medusajs/framework/utils"

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { provider } = req.params

  const paymentService = req.scope.resolve(Modules.PAYMENT)

  const event: ProviderWebhookPayload = {
    provider,
    payload: {
      data: req.body as Record<string, unknown>,
      rawData: req.rawBody,
      headers: req.headers,
    },
  }

  try {
    // Verifies that the provider is registered and, when the provider
    // supports it, that the webhook's signature is valid, before we
    // acknowledge the request and hand it off for async processing.
    await paymentService.getWebhookActionAndData(event)
  } catch (err) {
    // An unregistered provider is a missing resource, anything else (e.g. a
    // failed signature verification) is a bad request.
    const isUnknownProvider = err.type === MedusaError.Types.NOT_FOUND

    res
      .status(isUnknownProvider ? 404 : 400)
      .send(`Webhook Error: ${err.message}`)
    return
  }

  try {
    const options: PaymentModuleOptions =
      // @ts-expect-error "Not sure if .options exists on a module"
      paymentService.options || {}

    const eventBus = req.scope.resolve(Modules.EVENT_BUS)

    // we delay the processing of the event to avoid a conflict caused by a race condition
    await eventBus.emit(
      {
        name: PaymentWebhookEvents.WebhookReceived,
        data: event,
      },
      {
        delay: options.webhook_delay || 5000,
        attempts: options.webhook_retries || 3,
      }
    )
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  res.sendStatus(200)
}
