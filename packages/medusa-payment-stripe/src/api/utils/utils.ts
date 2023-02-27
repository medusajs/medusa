import { AwilixContainer } from "awilix"
import Stripe from "stripe"
import {
  AbstractCartCompletionStrategy,
  CartService,
  IdempotencyKeyService,
  PostgresError,
} from "@medusajs/medusa"
import { EOL } from "os"
import { MedusaError } from "medusa-core-utils"

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

export async function handlePaymentHook(event, req, res, paymentIntent) {
  const logger = req.scope.resolve("logger")

  const cartId = paymentIntent.metadata.cart_id // Backward compatibility
  const resourceId = paymentIntent.metadata.resource_id

  switch (event.type) {
    case "payment_intent.succeeded":
      try {
        await onPaymentIntentSucceeded({
          paymentIntent,
          cartId,
          resourceId,
          isPaymentCollection: isPaymentCollection(resourceId),
          container: req.scope,
        })
      } catch (err) {
        const message = buildError(event, err)
        logger.warn(message)
        return res.sendStatus(409)
      }

      break
    case "payment_intent.amount_capturable_updated":
      try {
        await onPaymentAmountCapturableUpdate({
          paymentIntent,
          cartId,
          container: req.scope,
        })
      } catch (err) {
        const message = buildError(event, err)
        logger.warn(message)
        return res.sendStatus(409)
      }

      break
    case "payment_intent.payment_failed": {
      const intent = event.data.object
      const message =
        intent.last_payment_error && intent.last_payment_error.message
      logger.error(
        `The payment of the payment intent ${intent.id} has failed${EOL}${message}`
      )
      break
    }
    default:
      res.sendStatus(204)
      return
  }

  res.sendStatus(200)
}

async function onPaymentIntentSucceeded({
  paymentIntent,
  cartId,
  resourceId,
  isPaymentCollection,
  container,
}) {
  const manager = container.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    await completeCartIfNecessary({
      paymentIntent,
      cartId,
      container,
      transactionManager,
    })

    if (isPaymentCollection) {
      await capturePaymenCollectiontIfNecessary({
        paymentIntent,
        resourceId,
        container,
      })
    } else {
      await capturePaymentIfNecessary({
        cartId,
        transactionManager,
        container,
      })
    }
  })
}

async function onPaymentAmountCapturableUpdate({
  paymentIntent,
  cartId,
  container,
}) {
  const manager = container.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    await completeCartIfNecessary({
      paymentIntent,
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
          .capture(payment.id)
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
    .retrieveByCartId(cartId)
    .catch(() => undefined)

  if (order.payment_status !== "captured") {
    const orderService = container.resolve("orderService")
    await orderService
      .withTransaction(transactionManager)
      .capturePayment(order.id)
  }
}

async function completeCartIfNecessary({
  paymentIntent,
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

    let idempotencyKey
    try {
      idempotencyKey = await idempotencyKeyService
        .withTransaction(transactionManager)
        .create({
          request_method: "post",
          request_path: "/stripe/hooks",
          request_params: {
            cart_id: cartId,
            payment_intent_id: paymentIntent.id,
          },
        })
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to create idempotency key",
        "400"
      )
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
        response_body["message"],
        response_body["code"].toString()
      )
    }
  }
}
