import { EOL } from "os"

import Stripe from "stripe"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { PostgresError } from "@medusajs/utils"
import { IPaymentModuleService } from "@medusajs/types"

export enum StripeWebhookEvent {
  IntentSucceeded = "payment_intent.succeeded",
  IntentFailed = "payment_intent.payment_failed",
  AmountCapturableUpdated = "payment_intent.amount_capturable_updated",
}

export async function handlePaymentHook({
  event,
  container,
  paymentIntent,
}: {
  event: Partial<Stripe.Event>
  container: any
  paymentIntent: Partial<Stripe.PaymentIntent>
}): Promise<{ statusCode: number }> {
  const logger = container.resolve("logger")

  const paymentSessionId = paymentIntent.metadata?.resource_id

  switch (event.type) {
    case StripeWebhookEvent.IntentSucceeded:
      try {
        await onPaymentIntentSucceeded({
          paymentIntent,
          paymentSessionId,
          container,
        })
      } catch (err) {
        const message = buildError(event.type, err)
        logger.warn(message)
        return { statusCode: 409 }
      }

      break
    case StripeWebhookEvent.AmountCapturableUpdated:
      try {
        await onPaymentAmountCapturableUpdate({
          eventId: event.id,
          paymentSessionId,
          container,
        })
      } catch (err) {
        const message = buildError(event.type, err)
        logger.warn(message)
        return { statusCode: 409 }
      }

      break
    case StripeWebhookEvent.IntentFailed: {
      const message =
        paymentIntent.last_payment_error &&
        paymentIntent.last_payment_error.message
      logger.error(
        `The payment of the payment intent ${paymentIntent.id} has failed${EOL}${message}`
      )
      break
    }
    default:
      return { statusCode: 204 }
  }

  return { statusCode: 200 }
}

async function onPaymentIntentSucceeded({
  paymentIntent,
  paymentSessionId,
  container,
}) {
  await capturePaymentIfNecessary({
    paymentIntent,
    paymentSessionId,
    container,
  })
}

async function onPaymentAmountCapturableUpdate({
  paymentSessionId,
  eventId,
  container,
}) {
  // TODO: Call complete cart workflow??
}

async function capturePaymentIfNecessary({
  paymentIntent,
  paymentSessionId,
  container,
}: {
  paymentIntent: Partial<Stripe.PaymentIntent>
  paymentSessionId: string
  container: any
}) {
  const paymentModuleService: IPaymentModuleService = container.resolve(
    ModuleRegistrationName.PAYMENT
  )

  const [payment] = await paymentModuleService.listPayments({
    session_id: paymentSessionId,
  })

  if (payment && !payment.captured_at) {
    await paymentModuleService.capturePayment({
      payment_id: payment.id,
      amount: payment.amount, // TODO: pull amount from the event
    })
  }
}

export function buildError(event: string, err: Stripe.StripeRawError): string {
  let message = `Stripe webhook ${event} handling failed${EOL}${
    err?.detail ?? err?.message
  }`
  if (err?.code === PostgresError.SERIALIZATION_FAILURE) {
    message = `Stripe webhook ${event} handle failed. This can happen when this webhook is triggered during a cart completion and can be ignored. This event should be retried automatically.${EOL}${
      err?.detail ?? err?.message
    }`
  }
  if (err?.code === "409") {
    message = `Stripe webhook ${event} handle failed.${EOL}${
      err?.detail ?? err?.message
    }`
  }

  return message
}
