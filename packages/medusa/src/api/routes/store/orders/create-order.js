import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    cart_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

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
          const { key, error } = await idempotencyKeyService.atomicPhase(
            idempotencyKey.idempotency_key,
            async session => {
              const cart = await cartService.retrieve(value.cart_id)
              let order

              try {
                order = await orderService
                  .withSession(session)
                  .createFromCart(cart)
              } catch (error) {
                if (
                  error &&
                  error.message === "Order from cart already exists"
                ) {
                  order = await orderService.retrieveByCartId(value.cart_id)
                } else {
                  throw error
                }
              }

              order = await orderService.decorate(order, [
                "status",
                "fulfillment_status",
                "payment_status",
                "email",
                "billing_address",
                "shipping_address",
                "items",
                "region",
                "discounts",
                "customer_id",
                "payment_method",
                "shipping_methods",
                "metadata",
              ])

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
  } catch (err) {
    throw err
  }
}
