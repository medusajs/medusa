import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    items: Validator.array()
      .items({
        item_id: Validator.string().required(),
        quantity: Validator.number().required(),
      })
      .required(),
    return_shipping: Validator.object()
      .keys({
        option_id: Validator.string().optional(),
        price: Validator.number()
          .integer()
          .optional(),
      })
      .optional(),
    receive_now: Validator.boolean().default(false),
    refund: Validator.number()
      .integer()
      .optional(),
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
    const eventBus = req.scope.resolve("eventBusService")

    let inProgress = true
    let err = false

    while (inProgress) {
      switch (idempotencyKey.recovery_point) {
        case "started": {
          const { key, error } = await idempotencyKeyService.workStage(
            idempotencyKey.idempotency_key,
            async manager => {
              const order = await orderService
                .withTransaction(manager)
                .retrieve(id, {
                  select: ["refunded_total", "total"],
                  relations: ["items"],
                })

              const returnObj = {
                order_id: id,
                idempotency_key: idempotencyKey.idempotency_key,
                items: value.items,
              }

              if (value.return_shipping) {
                returnObj.shipping_method = value.return_shipping
              }

              if (typeof value.refund !== "undefined" && value.refund < 0) {
                returnObj.refund_amount = 0
              } else {
                if (value.refund) {
                  returnObj.refund_amount = value.refund
                }
              }

              const createdReturn = await returnService
                .withTransaction(manager)
                .create(returnObj, order)

              if (value.return_shipping) {
                await returnService
                  .withTransaction(manager)
                  .fulfill(createdReturn.id)
              }

              await eventBus
                .withTransaction(manager)
                .emit("order.return_requested", {
                  id,
                  return_id: createdReturn.id,
                })

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
                .withTransaction(manager)
                .retrieve(id, { relations: ["returns"] })

              /**
               * If we are ready to receive immediately, we find the newly created return
               * and register it as received.
               */
              if (value.receive_now) {
                let ret = await returnService.withTransaction(manager).list({
                  idempotency_key: idempotencyKey.idempotency_key,
                })

                if (!ret.length) {
                  throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    `Return not found`
                  )
                }

                ret = ret[0]

                order = await returnService
                  .withTransaction(manager)
                  .receiveReturn(order.id, ret.id, value.items, value.refund)
              }

              order = await orderService.withTransaction(manager).retrieve(id, {
                select: defaultFields,
                relations: defaultRelations,
              })

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
    console.log(err)
    throw err
  }
}
