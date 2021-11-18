import { OrderService } from "../../../../services"

/**
 * @oas [post] /orders/{id}/complete
 * operationId: "PostOrdersOrderComplete"
 * summary: "Complete an Order"
 * description: "Completes an Order"
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

  await orderService.completeOrder(id)

  const order = await orderService.retrieve(id, {
    relations: ["region", "customer", "swaps"],
  })

  res.json({ order })
}
