import { defaultAdminOrdersRelations, defaultAdminOrdersFields } from "."
import { OrderService } from "../../../../services"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /orders/{id}/capture
 * operationId: "PostOrdersOrderCapture"
 * summary: "Capture an Order"
 * description: "Captures all the Payments associated with an Order."
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
    return await orderService
      .withTransaction(transactionManager)
      .capturePayment(id)
  })

  const order = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.json({ order })
}
