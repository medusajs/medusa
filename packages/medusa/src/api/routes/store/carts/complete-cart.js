export default async (req, res) => {
  const { id } = req.params

  const idempotencyKeyService = req.scope.resolve("idempotencyKeyService")

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey
  try {
    idempotencyKey = await idempotencyKeyService.initializeRequest(
      headerKey,
      req.method,
      req.params,
      req.path
    )
  } catch (error) {
    res.status(409).send("Failed to create idempotency key")
    return
  }

  res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key")
  res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key)

  try {
    const cartService = req.scope.resolve("cartService")
    const orderService = req.scope.resolve("orderService")

    let inProgress = true
    let err = false

    while (inProgress) {
      switch (idempotencyKey.recovery_point) {
        case "started": {
          const { key, error } = await idempotencyKeyService.workStage(
            idempotencyKey.idempotency_key,
            async manager => {
              await cartService.withTransaction(manager).authorizePayment(id)

              return {
                recovery_point: "payment_authorized",
              }
            }
          )

          if (error) {
            inProgress = false
            err = error
          } else {
            idempotencyKey = key
          }
          break
        }

        case "payment_authorized": {
          const { key, error } = await idempotencyKeyService.workStage(
            idempotencyKey.idempotency_key,
            async manager => {
              // Recovery: Started
              const cart = await cartService
                .withTransaction(manager)
                .retrieve(id, ["payment_session"])

              let order

              //  if (error) return error
              //  if (requires_action) return { status: requires_action, data: {} }

              if (cart.payment_session.status === "authorized") {
                try {
                  order = await orderService
                    .withTransaction(manager)
                    .createFromCart(cart.id)
                } catch (error) {
                  if (
                    error &&
                    error.message === "Order from cart already exists"
                  ) {
                    order = await orderService
                      .withTransaction(manager)
                      .retrieveByCartId(value.cart_id)

                    return {
                      response_code: 200,
                      response_body: { order },
                    }
                  } else {
                    throw error
                  }
                }

                order = await orderService
                  .withTransaction(manager)
                  .retrieve(order.id)
              }

              return {
                response_code: 200,
                response_body: { order },
              }
            }
          )

          if (error) {
            inProgress = false
            err = error
          } else {
            idempotencyKey = key
          }
          break
        }

        case "finished": {
          inProgress = false
          break
        }

        default:
          idempotencyKey = await idempotencyKeyService.update(
            idempotencyKey.idempotency_key,
            {
              recovery_point: "finished",
              response_code: 500,
              response_body: { message: "Unknown recovery point" },
            }
          )
          break
      }
    }

    if (err) {
      throw err
    }

    res.status(idempotencyKey.response_code).json(idempotencyKey.response_body)
  } catch (error) {
    throw error
  }
}
