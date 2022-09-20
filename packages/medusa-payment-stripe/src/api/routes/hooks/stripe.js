import { IdempotencyKeyRepository } from "@medusajs/medusa/dist/repositories/idempotency-key"

export default async (req, res) => {
  const signature = req.headers["stripe-signature"]

  let event
  try {
    const stripeProviderService = req.scope.resolve("pp_stripe")
    event = stripeProviderService.constructWebhookEvent(req.body, signature)
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  const paymentIntent = event.data.object

  const cartService = req.scope.resolve("cartService")
  const orderService = req.scope.resolve("orderService")

  const cartId = paymentIntent.metadata.cart_id
  const order = await orderService
    .retrieveByCartId(cartId)
    .catch(() => undefined)

  let responseCode

  // handle payment intent events
  switch (event.type) {
    case "payment_intent.succeeded":
      if (order && order.payment_status !== "captured") {
        await manager.transaction(async (manager) => {
          await orderService.withTransaction(manager).capturePayment(order.id)
        })
      }
      break
    case "payment_intent.amount_capturable_updated":
      if (!order) {
        // Find and use the same idempotency that has been created and used for the cart that is used for that payment
        let idempotencyKey
        try {
          idempotencyKey = await manager.transaction(
            async (transactionManager) => {
              const idempotencyKeyRepository =
                transactionManager.getCustomRepository(IdempotencyKeyRepository)
              return await idempotencyKeyRepository
                .createQueryBuilder("idKey")
                .where("idKey.request_params->>'id' = :cart_id", {
                  cart_id: cartId,
                })
                .andWhere("idKey.request_method = :method", { method: "POST" })
                .andWhere("idKey.request_path = :path", {
                  path: `/${cartId}/complete`,
                })
                .getOneOrFail()
            }
          )
        } catch (error) {
          console.log(error)
          res.status(409).send("Failed to retrieve or create idempotency key")
          return
        }

        const { response_code } = await manager.transaction(async (manager) => {
          const completionStrategy = req.scope.resolve("cartCompletionStrategy")

          const { context } = await cartService
            .withTransaction(manager)
            .retrieve(cartId, { select: ["context"] })

          return await completionStrategy.complete(
            cartId,
            idempotencyKey.idempotency_key,
            context
          )
        })
        responseCode = response_code
      }
      break
    default:
      res.sendStatus(204)
      return
  }

  res.sendStatus(responseCode ?? 200)
}
