import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    items: Validator.array()
      .items({
        item_id: Validator.string().required(),
        quantity: Validator.number().required(),
      })
      .required(),
    shipping_method: Validator.string().optional(),
    shipping_price: Validator.number().optional(),
    receive_now: Validator.boolean().default(false),
    refund: Validator.number().optional(),
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
    const orderService = req.scope.resolve("orderService")
    const returnService = req.scope.resolve("returnService")

    let inProgress = true
    let err = false

    while (inProgress) {
      switch (idempotencyKey.recovery_point) {
        case "started": {
          const { key, error } = await idempotencyKeyService.workStage(
            idempotencyKey.idempotency_key,
            async manager => {
              let oldOrder
              let existingReturns = []

              if (value.receive_now) {
                oldOrder = await orderService
                  .withTransction(manager)
                  .retrieve(id, ["returns"])
                existingReturns = oldOrder.returns.map(r => r.id)
              }

              let shippingMethod
              if (value.shipping_method) {
                shippingMethod = {
                  id: value.shipping_method,
                  price: value.shipping_price,
                }
              }

              let refundAmount = value.refund
              if (typeof value.refund !== "undefined" && value.refund < 0) {
                refundAmount = 0
              }

              let order = await returnService.requestReturn(
                id,
                value.items,
                shippingMethod,
                refundAmount
              )

              return {
                recovery_point: "return_requested",
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

        case "return_requested": {
          const { key, error } = await idempotencyKeyService.workStage(
            idempotencyKey.idempotency_key,
            async manager => {
              let order = await orderService
                .withTransction(manager)
                .retrieve(id)
              /**
               * If we are ready to receive immediately, we find the newly created return
               * and register it as received.
               */
              if (value.receive_now) {
                const newReturn = order.returns.find(
                  r => !existingReturns.includes(r.id)
                )
                order = await orderService.return(
                  id,
                  newReturn.id,
                  value.items,
                  value.refund
                )
              }

              order = await orderService.retrieve(id, [
                "region",
                "customer",
                "swaps",
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

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}
