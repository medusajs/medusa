import { AwilixContainer } from "awilix"
import Stripe from "stripe"
import { PostgresError } from "@medusajs/medusa"

const PAYMENT_PROVIDER_KEY = "pp_stripe"

export function constructWebhook({
  signature,
  body,
  container,
}: {
  signature: string | string[] | undefined
  body: any
  container: AwilixContainer
}): Stripe.Event {
  const stripeProviderService = container.resolve(PAYMENT_PROVIDER_KEY)
  return stripeProviderService.constructWebhookEvent(body, signature)
}

export function isPaymentCollection(id) {
  return id && id.startsWith("paycol")
}

export function buildHandleCartPaymentErrorMessage(
  event: string,
  err: Stripe.StripeRawError
): string {
  let message = `Stripe webhook ${event} handling failed\n${
    err?.detail ?? err?.message
  }`
  if (err?.code === PostgresError.SERIALIZATION_FAILURE) {
    message = `Stripe webhook ${event} handle failed. This can happen when this webhook is triggered during a cart completion and can be ignored. This event should be retried automatically.\n${
      err?.detail ?? err?.message
    }`
  }
  if (err?.code === "409") {
    message = `Stripe webhook ${event} handle failed.\n${
      err?.detail ?? err?.message
    }`
  }

  return message
}
