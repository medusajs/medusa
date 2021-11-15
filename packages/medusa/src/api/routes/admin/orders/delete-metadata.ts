import { OrderService } from "../../../../services"

/**
 * @oas [delete] /order/{id}/metadata/{key}
 * operationId: "DeleteOrdersOrderMetadataKey"
 * summary: "Delete Metadata"
 * description: "Deletes a metadata key."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   - (path) key=* {string} The metadata key.
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
  const { id, key } = req.params

  const orderService: OrderService = req.scope.resolve("orderService")

  await orderService.deleteMetadata(id, key)

  const order = await orderService.retrieve(id, {
    relations: ["region", "customer", "swaps"],
  })

  res.status(200).json({ order })
}
