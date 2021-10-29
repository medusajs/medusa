import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /orders/{id}/swaps/{swap_id}/process-payment
 * operationId: "PostOrdersOrderSwapsSwapProcessPayment"
 * summary: "Process a Swap difference"
 * description: "When there are differences between the returned and shipped Products in a Swap, the difference must be processed. Either a Refund will be issued or a Payment will be captured."
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   - (path) swap_id=* {string} The id of the Swap.
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

  const orderService = req.scope.resolve("orderService")
  const swapService = req.scope.resolve("swapService")
  const entityManager = req.scope.resolve("manager")

  await entityManager.transaction(async (manager) => {
    await swapService.withTransaction(manager).processDifference(swap_id)

    const order = await orderService.withTransaction(manager).retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ order })
  })
}
