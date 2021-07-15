import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /orders/{id}/swaps/{swap_id}/fulfillments
 * operationId: "PostOrdersOrderSwapsSwapFulfillments"
 * summary: "Create a Swap Fulfillment"
 * description: "Creates a Fulfillment for a Swap."
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   - (path) swap_id=* {string} The id of the Swap.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
 *           no_notification:
 *             description: If set to true no notification will be send related to this Claim.
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
  const { id, swap_id } = req.params

  const schema = Validator.object().keys({
    metadata: Validator.object().optional(),
    no_notification: Validator.boolean().optional,
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    const swapService = req.scope.resolve("swapService")
    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      await swapService.withTransaction(manager).createFulfillment(swap_id, {
        metadata: value.metadata,
        no_notification: value.no_notification,
      })

      const order = await orderService.withTransaction(manager).retrieve(id, {
        select: defaultFields,
        relations: defaultRelations,
      })

      res.status(200).json({ order })
    })
  } catch (err) {
    throw err
  }
}
