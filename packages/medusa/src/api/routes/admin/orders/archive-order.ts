import { OrderService } from "../../../../services"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /orders/{id}/archive
 * operationId: "PostOrdersOrderArchive"
 * summary: "Archive order"
 * description: "Archives the order with the given id."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Order.
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

  const orderService: OrderService = req.scope.resolve("orderService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await orderService.withTransaction(transactionManager).archive(id)
  })

  const order = await orderService.retrieve(id, {
    relations: ["region", "customer", "swaps"],
  })

  res.json({ order })
}
