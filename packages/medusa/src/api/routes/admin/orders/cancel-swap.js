import { MedusaError } from "medusa-core-utils"

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
    const swap = await swapService.retrieve(swap_id)

    throw new Error(swap)

    if (swap.order_id !== id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `no swap was found with the id: ${swap_id} related to order: ${id}`
      )
    }

    const result = await swapService.cancel(swap_id)

    res.json({ result })
  } catch (error) {
    throw error
  }
}
