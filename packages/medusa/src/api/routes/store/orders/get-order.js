import { defaultRelations, defaultFields } from "./index"

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

  try {
    const orderService = req.scope.resolve("orderService")
    const order = await orderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ order })
  } catch (error) {
    console.log(error)
    throw error
  }
}
