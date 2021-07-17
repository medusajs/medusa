import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /orders/{id}/returns
 * operationId: "PostOrdersOrderReturns"
 * summary: "Request a Return"
 * description: "Requests a Return. If applicable a return label will be created and other plugins notified."
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           items:
 *             description: The Line Items that will be returned.
 *             type: array
 *             items:
 *               properties:
 *                 item_id:
 *                   description: The id of the Line Item.
 *                   type: string
 *                 reason_id:
 *                   description: The id of the Return Reason to use.
 *                   type: string
 *                 note:
 *                   description: An optional note with information about the Return.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Line Item.
 *                   type: integer
 *           return_shipping:
 *             description: The Shipping Method to be used to handle the return shipment.
 *             type: object
 *             properties:
 *               option_id:
 *                 type: string
 *                 description: The id of the Shipping Option to create the Shipping Method from.
 *               price:
 *                 type: integer
 *                 description: The price to charge for the Shipping Method.
 *           receive_now:
 *             description: A flag to indicate if the Return should be registerd as received immediately.
 *             type: boolean
 *           no_notification:
 *             description: A flag to indicate if no notifications should be emitted related to the requested Return.
 *             type: boolean
 *           refund:
 *             description: The amount to refund.
 *             type: integer
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/order"
 */
export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
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
        price: Validator.number()
          .integer()
          .optional(),
      })
      .optional(),
    receive_now: Validator.boolean().default(false),
    no_notification: Validator.boolean().optional(),
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
                if (value.refund >= 0) {
                  returnObj.refund_amount = value.refund
                }
              }

              let order = await orderService
                .withTransaction(manager)
                .retrieve(id)

              const evaluatedNoNotification =
                value.no_notification !== undefined
                  ? value.no_notification
                  : order.no_notification
              returnObj.no_notification = evaluatedNoNotification

              const createdReturn = await returnService
                .withTransaction(manager)
                .create(returnObj)

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
                  no_notification: evaluatedNoNotification,
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
                  .receive(ret.id, value.items, value.refund)
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
