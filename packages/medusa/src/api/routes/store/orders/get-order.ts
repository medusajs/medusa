import { OrderService } from "../../../../services"
import { defaultStoreOrdersFields, defaultStoreOrdersRelations } from "./index"

/**
 * @oas [get] /orders/{id}
 * operationId: GetOrdersOrder
 * summary: Retrieves an Order
 * description: "Retrieves an Order"
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
 *             customer:
 *               $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const { id } = req.params

  const orderService: OrderService = req.scope.resolve("orderService")
  const order = await orderService.retrieve(id, {
    select: defaultStoreOrdersFields,
    relations: defaultStoreOrdersRelations,
  })

  res.json({ order })
}
