import { MedusaError, Validator } from "medusa-core-utils"

import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /swaps
 * operationId: PostSwaps
 * summary: Create a Swap
 * description: "Creates a Swap on an Order by providing some items to return along with some items to send back"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           order_id:
 *             type: string
 *             description: The id of the Order to create the Swap for.
 *           return_items:
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
 *           return_shipping_option:
 *             type: string
 *             description: The id of the Shipping Option to create the Shipping Method from.
 *           additional_items:
 *             description: "The items to exchange the returned items to."
 *             type: array
 *             items:
 *               properties:
 *                 variant_id:
 *                   description: The id of the Product Variant to send.
 *                   type: string
 *                 quantity:
 *                   description: The quantity to send of the variant.
 *                   type: integer
 * tags:
 *   - Swap
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             swap:
 *               $ref: "#/components/schemas/swap"
 */
export default async (req, res) => {
  const schema = Validator.object().keys({
    order_id: Validator.string().required(),
    return_items: Validator.array()
      .items({
        item_id: Validator.string().required(),
        quantity: Validator.number().required(),
        reason_id: Validator.string().optional(),
        note: Validator.string().optional(),
      })
      .required(),
    return_shipping_option: Validator.string().optional(),
    additional_items: Validator.array().items({
      variant_id: Validator.string().required(),
      quantity: Validator.number().required(),
    }),
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
    const swapService = req.scope.resolve("swapService")
    const returnService = req.scope.resolve("returnService")

    let inProgress = true
    let err = false

    while (inProgress) {
      switch (idempotencyKey.recovery_point) {
        case "started": {
          const { key, error } = await idempotencyKeyService.workStage(
            idempotencyKey.idempotency_key,
            async (manager) => {
              const order = await orderService
                .withTransaction(manager)
                .retrieve(value.order_id, {
                  select: ["refunded_total", "total"],
                  relations: ["items", "swaps", "swaps.additional_items"],
                })

              let returnShipping
              if (value.return_shipping_option) {
                returnShipping = {
                  option_id: value.return_shipping_option,
                }
              }

              const swap = await swapService
                .withTransaction(manager)
                .create(
                  order,
                  value.return_items,
                  value.additional_items,
                  returnShipping,
                  {
                    idempotency_key: idempotencyKey.idempotency_key,
                    no_notification: true,
                  }
                )

              await swapService.withTransaction(manager).createCart(swap.id)
              const returnOrder = await returnService
                .withTransaction(manager)
                .retrieveBySwap(swap.id)

              await returnService
                .withTransaction(manager)
                .fulfill(returnOrder.id)

              return {
                recovery_point: "swap_created",
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

        case "swap_created": {
          const { key, error } = await idempotencyKeyService.workStage(
            idempotencyKey.idempotency_key,
            async (manager) => {
              const swaps = await swapService.list({
                idempotency_key: idempotencyKey.idempotency_key,
              })

              if (!swaps.length) {
                throw new MedusaError(
                  MedusaError.Types.INVALID_DATA,
                  "Swap not found"
                )
              }

              const swap = await swapService.retrieve(swaps[0].id, {
                select: defaultFields,
                relations: defaultRelations,
              })

              return {
                response_code: 200,
                response_body: { swap },
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
