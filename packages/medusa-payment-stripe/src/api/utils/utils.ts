import {
  AbstractCartCompletionStrategy,
  CartService,
  IdempotencyKeyService,
  PostgresError,
} from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import { AwilixContainer } from "awilix"
import { EOL } from "os"
import Stripe from "stripe"

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

export async function handlePaymentHook({
  event,
  container,
  paymentIntent,
}: {
  event: Partial<Stripe.Event>
  container: AwilixContainer
  paymentIntent: Partial<Stripe.PaymentIntent>
}): Promise<{ statusCode: number }> {
  const logger = container.resolve("logger")

  const cartId =
    paymentIntent.metadata?.cart_id ?? paymentIntent.metadata?.resource_id // Backward compatibility
  const resourceId = paymentIntent.metadata?.resource_id

  switch (event.type) {
    case "payment_intent.succeeded":
      try {
        await onPaymentIntentSucceeded({
          eventId: event.id,
          paymentIntent,
          cartId,
          resourceId,
          isPaymentCollection: isPaymentCollection(resourceId),
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
          cartId,
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
  eventId,
  paymentIntent,
  cartId,
  resourceId,
  isPaymentCollection,
  container,
}) {
  const manager = container.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    if (isPaymentCollection) {
      await capturePaymenCollectiontIfNecessary({
        paymentIntent,
        resourceId,
        container,
      })
    } else {
      await completeCartIfNecessary({
        eventId,
        cartId,
        container,
        transactionManager,
      })

      await capturePaymentIfNecessary({
        cartId,
        transactionManager,
        container,
      })
    }
  })
}

async function onPaymentAmountCapturableUpdate({ eventId, cartId, container }) {
  const manager = container.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    await completeCartIfNecessary({
      eventId,
      cartId,
      container,
      transactionManager,
    })
  })
}

async function capturePaymenCollectiontIfNecessary({
  paymentIntent,
  resourceId,
  container,
}) {
  const manager = container.resolve("manager")
  const paymentCollectionService = container.resolve("paymentCollectionService")

  const paycol = await paymentCollectionService
    .retrieve(resourceId, { relations: ["payments"] })
    .catch(() => undefined)

  if (paycol?.payments?.length) {
    const payment = paycol.payments.find(
      (pay) => pay.data.id === paymentIntent.id
    )

    if (payment && !payment.captured_at) {
      await manager.transaction(async (manager) => {
        await paymentCollectionService
          .withTransaction(manager)
          .capture(payment.id) // TODO: revisit - this method doesn't exists ATM
      })
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

async function completeCartIfNecessary({
  eventId,
  cartId,
  container,
  transactionManager,
}) {
  const orderService = container.resolve("orderService")
  const order = await orderService
    .retrieveByCartId(cartId)
    .catch(() => undefined)

  if (!order) {
    const completionStrat: AbstractCartCompletionStrategy = container.resolve(
      "cartCompletionStrategy"
    )
    const cartService: CartService = container.resolve("cartService")
    const idempotencyKeyService: IdempotencyKeyService = container.resolve(
      "idempotencyKeyService"
    )

    const idempotencyKeyServiceTx =
      idempotencyKeyService.withTransaction(transactionManager)
    let idempotencyKey = await idempotencyKeyServiceTx
      .retrieve({
        request_path: "/stripe/hooks",
        idempotency_key: eventId,
      })
      .catch(() => undefined)

    if (!idempotencyKey) {
      idempotencyKey = await idempotencyKeyService
        .withTransaction(transactionManager)
        .create({
          request_path: "/stripe/hooks",
          idempotency_key: eventId,
        })
    }

    const cart = await cartService
      .withTransaction(transactionManager)
      .retrieve(cartId, { select: ["context"] })

    const { response_code, response_body } = await completionStrat
      .withTransaction(transactionManager)
      .complete(cartId, idempotencyKey, { ip: cart.context?.ip as string })

    if (response_code !== 200) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        response_body["message"] as string,
        response_body["code"] as string
      )
    }
  }
}
