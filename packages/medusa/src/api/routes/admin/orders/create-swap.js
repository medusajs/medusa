import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /order/{id}/swaps
 * operationId: "PostOrdersOrderSwaps"
 * summary: "Create a Swap"
 * description: "Creates a Swap. Swaps are used to handle Return of previously purchased goods and Fulfillment of replacements simultaneously."
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           return_items:
 *             description: The Line Items to return as part of the Swap.
 *             type: array
 *             items:
 *               properties:
 *                 item_id:
 *                   description: The id of the Line Item that will be claimed.
 *                   type: string
 *                 quantity:
 *                   description: The number of items that will be returned
 *                   type: integer
 *           return_shipping:
 *             description: How the Swap will be returned.
 *             type: object
 *             properties:
 *               option_id:
 *                 type: string
 *                 description: The id of the Shipping Option to create the Shipping Method from.
 *               price:
 *                 type: integer
 *                 description: The price to charge for the Shipping Method.
 *           additional_items:
 *             description: The new items to send to the Customer.
 *             type: array
 *             items:
 *               properties:
 *                 variant_id:
 *                   description: The id of the Product Variant to ship.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Product Variant to ship.
 *                   type: integer
 *           no_notification:
 *             description: If set to true no notification will be send related to this Swap.
 *             type: boolean
 *           allow_backorder:
 *             description: If true, swaps can be completed with items out of stock
 *             type: boolean
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
    return_items: Validator.array()
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
    rma_shipping_options: Validator.array().items({
      option_id: Validator.string().optional(),
      price: Validator.number()
        .integer()
        .optional(),
    }),
    additional_items: Validator.array().items({
      variant_id: Validator.string().required(),
      quantity: Validator.number().required(),
    }),
    no_notification: Validator.boolean().optional(),
    allow_backorder: Validator.boolean().default(true),
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
            async manager => {
              const order = await orderService
                .withTransaction(manager)
                .retrieve(id, {
                  select: ["refunded_total", "total"],
                  relations: ["items", "swaps", "swaps.additional_items"],
                })

              const swap = await swapService
                .withTransaction(manager)
                .create(
                  order,
                  value.return_items,
                  value.additional_items,
                  value.return_shipping,
                  value.rma_shipping_options,
                  {
                    idempotency_key: idempotencyKey.idempotency_key,
                    no_notification: value.no_notification,
                    allow_backorder: value.allow_backorder,
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
            async manager => {
              const swaps = await swapService.list({
                idempotency_key: idempotencyKey.idempotency_key,
              })

              if (!swaps.length) {
                throw new MedusaError(
                  MedusaError.Types.INVALID_DATA,
                  "Swap not found"
                )
              }

              const order = await orderService.retrieve(id, {
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
  } catch (error) {
    throw error
  }
}
