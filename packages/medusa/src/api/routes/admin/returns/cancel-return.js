import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "../orders"

/**
 * @oas [post] /returns/{id}/cancel
 * operationId: "PostReturnsReturnCancel"
 * summary: "Cancel a Return"
 * description: "Registers a Return as canceled."
 * parameters:
 *   - (path) id=* {string} The id of the Return.
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
 *               $ref: "#/components/schemas/order"
 */
export default async (req, res) => {
  const { id } = req.params

  try {
    const returnService = req.scope.resolve("returnService")
    const orderService = req.scope.resolve("orderService")

    const result = await returnService.cancel(id)

    const order = await orderService.retrieve(result.order_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}
