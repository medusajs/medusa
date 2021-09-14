import { MedusaError } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "."

/**
 * @oas [post] /orders/{id}/swaps/{swap_id}/cancel
 * operationId: "PostOrdersSwapCancel"
 * summary: "Cancels a Swap"
 * description: "Cancels a Swap"
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   . (path) swap_id=* {string} The id of the Swap.
 * tags:
 *   - Swap
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/swap"
 */
export default async (req, res) => {
  const { id, swap_id } = req.params

  try {
    const swapService = req.scope.resolve("swapService")
    const orderService = req.scope.resolve("orderService")

    const swap = await swapService.retrieve(swap_id)

    if (swap.order_id !== id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `no swap was found with the id: ${swap_id} related to order: ${id}`
      )
    }

    await swapService.cancel(swap_id)

    const order = await orderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ order })
  } catch (error) {
    throw error
  }
}
