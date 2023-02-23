import { Request, Response } from "express"
import {
  buildHandleCartPaymentErrorMessage,
  constructWebhook,
  isPaymentCollection,
} from "../utils/utils"
import {
  AbstractCartCompletionStrategy,
  CartService,
  IdempotencyKeyService,
} from "@medusajs/medusa"
import { MedusaError } from "medusa-core-utils"

export default async (req: Request, res: Response) => {
  let event
  try {
    event = constructWebhook({
      signature: req.headers["stripe-signature"],
      body: req.body,
      container: req.scope,
    })
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  const paymentIntent = event.data.object
  const cartId = paymentIntent.metadata.cart_id // Backward compatibility
  const resourceId = paymentIntent.metadata.resource_id

  if (isPaymentCollection(resourceId)) {
    await handlePaymentCollection(event, req, res, resourceId, paymentIntent.id)
  } else {
    await handleCartPayments(event, req, res, cartId ?? resourceId)
  }
}

async function handleCartPayments(event, req, res, cartId) {
  const manager = req.scope.resolve("manager")
  const orderService = req.scope.resolve("orderService")
  const logger = req.scope.resolve("logger")

  const order = await orderService
    .retrieveByCartId(cartId)
    .catch(() => undefined)

  // handle payment intent events
  switch (event.type) {
    case "payment_intent.succeeded":
      if (order) {
        // If order is created but not captured, we attempt to do so
        if (order.payment_status !== "captured") {
          await manager.transaction(async (manager) => {
            await orderService.withTransaction(manager).capturePayment(order.id)
          })
        } else {
          // Otherwise, respond with 200 preventing Stripe from retrying
          return res.sendStatus(200)
        }
      } else {
        // If order is not created, we respond with 404 to trigger Stripe retry mechanism
        return res.sendStatus(404)
      }
      break
    case "payment_intent.amount_capturable_updated":
      try {
        await manager.transaction(async (manager) => {
          await paymentIntentAmountCapturableEventHandler({
            order,
            cartId,
            container: req.scope,
            transactionManager: manager,
          })
        })
      } catch (err) {
        const message = buildHandleCartPaymentErrorMessage(event, err)
        logger.warn(message)
        return res.sendStatus(409)
      }
      break
    default:
      res.sendStatus(204)
      return
  }

  res.sendStatus(200)
}

async function handlePaymentCollection(event, req, res, id, paymentIntentId) {
  const manager = req.scope.resolve("manager")
  const paymentCollectionService = req.scope.resolve("paymentCollectionService")

  const paycol = await paymentCollectionService
    .retrieve(id, { relations: ["payments"] })
    .catch(() => undefined)

  if (paycol?.payments?.length) {
    if (event.type === "payment_intent.succeeded") {
      const payment = paycol.payments.find(
        (pay) => pay.data.id === paymentIntentId
      )
      if (payment && !payment.captured_at) {
        await manager.transaction(async (manager) => {
          await paymentCollectionService
            .withTransaction(manager)
            .capture(payment.id)
        })
      }

      res.sendStatus(200)
      return
    }
  }
  res.sendStatus(204)
}

async function paymentIntentAmountCapturableEventHandler({
  order,
  cartId,
  container,
  transactionManager,
}) {
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
        .initializeRequest("", "post", { cart_id: cartId }, "/stripe/hooks")
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to create idempotency key",
        "409"
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
