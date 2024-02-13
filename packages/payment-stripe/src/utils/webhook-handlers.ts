import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { PostgresError } from "@medusajs/utils"
import { EOL } from "os"
import Stripe from "stripe"

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

  const paymentCollectionId = paymentIntent.metadata?.payment_collection_id

  switch (event.type) {
    case "payment_intent.succeeded":
      try {
        await onPaymentIntentSucceeded({
          paymentIntent,
          paymentCollectionId,
          container,
        })
      } catch (err) {
        const message = buildError(event.type, err)
        logger.warn(message)
        return { statusCode: 409 }
      }

      break
    case "payment_intent.amount_capturable_updated":
      try {
        await onPaymentAmountCapturableUpdate({
          eventId: event.id,
          paymentCollectionId,
          container,
        })
      } catch (err) {
        const message = buildError(event.type, err)
        logger.warn(message)
        return { statusCode: 409 }
      }

      break
    case "payment_intent.payment_failed": {
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
  paymentCollectionId,
  container,
}) {
  await capturePaymentCollectionIfNecessary({
    paymentIntent,
    paymentCollectionId,
    container,
  })
}

async function onPaymentAmountCapturableUpdate({
  paymentCollectionId,
  eventId,
  container,
}) {
  // TODO: Call complete cart workflow??
}

async function capturePaymentCollectionIfNecessary({
  paymentIntent,
  paymentCollectionId,
  container,
}: {
  paymentIntent: Partial<Stripe.PaymentIntent>
  paymentCollectionId: string
  container: any
}) {
  const paymentModuleService = container.resolve(ModuleRegistrationName.PAYMENT)

  const paycol = await paymentModuleService
    .retrieve(paymentCollectionId, { relations: ["payments"] })
    .catch(() => undefined)

  if (paycol?.payments?.length) {
    const payment = paycol.payments.find(
      (pay) => pay.data.id === paymentIntent.id
    )

    if (payment && !payment.captured_at) {
      await paymentModuleService.capture(payment.id)
    }
  }
}

async function capturePaymentIfNecessary({
  cartId,
  transactionManager,
  container,
}) {
  const orderService = container.resolve("orderService")
  const order = await orderService
    .withTransaction(transactionManager)
    .retrieveByCartId(cartId)
    .catch(() => undefined)

  if (order && order.payment_status !== "captured") {
    await orderService
      .withTransaction(transactionManager)
      .capturePayment(order.id)
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
