import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [post] /returns
 * operationId: "PostReturns"
 * summary: "Create Return"
 * description: "Creates a Return for an Order."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           order_id:
 *             type: string
 *             description: The id of the Order to create the Return from.
 *           items:
 *             description: "The items to include in the Return."
 *             type: array
 *             items:
 *               properties:
 *                 item_id:
 *                   description: The id of the Line Item from the Order.
 *                   type: string
 *                 quantity:
 *                   description: The quantity to return.
 *                   type: integer
 *           return_shipping:
 *             description: If the Return is to be handled by the store operator the Customer can choose a Return Shipping Method. Alternatvely the Customer can handle the Return themselves.
 *             type: object
 *             properties:
 *               option_id:
 *                 type: string
 *                 description: The id of the Shipping Option to create the Shipping Method from.
 *           no_notification:
 *             description: If set to true no notification will be send
 *             type: boolean
 *             
 * tags:
 *   - Return
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             return:
 *               $ref: "#/components/schemas/return"
 */
export default async (req, res) => {
  const schema = Validator.object().keys({
    order_id: Validator.string().required(),
    items: Validator.array()
      .items({
        item_id: Validator.string().required(),
        quantity: Validator.number().required(),
        reason_id: Validator.string().optional(),
        note: Validator.string().optional(),
      })
      .required(),
    return_shipping: Validator.object()
      .keys({
        option_id: Validator.string().optional(),
      })
      .optional(),
    no_notification: Validator.boolean().optional()
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
                .retrieve(value.order_id, {
                  select: ["refunded_total", "total"],
                  relations: ["items"],
                })

              const returnObj = {
                order_id: value.order_id,
                idempotency_key: idempotencyKey.idempotency_key,
                items: value.items,
              }

              if (value.return_shipping) {
                returnObj.shipping_method = value.return_shipping
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
                  id: value.order_id,
                  return_id: createdReturn.id,
                  no_notification: no_notification
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
              let ret = await returnService.withTransaction(manager).list(
                {
                  idempotency_key: idempotencyKey.idempotency_key,
                },
                {
                  relations: ["items", "items.reason"],
                }
              )
              if (!ret.length) {
                throw new MedusaError(
                  MedusaError.Types.INVALID_DATA,
                  `Return not found`
                )
              }
              ret = ret[0]

              return {
                response_code: 200,
                response_body: { return: ret },
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
