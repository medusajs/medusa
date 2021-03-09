import { defaultFields, defaultRelations } from "."

/**
 * @oas [get] /orders/cart/{cart_id}
 * operationId: GetOrdersOrderCartId
 * summary: Retrieves Order by Cart id
 * description: "Retrieves an Order by the id of the Cart that was used to create the Order."
 * parameters:
 *   - (path) cart_id=* {string} The id of Cart.
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
  const { cart_id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    const order = await orderService.retrieveByCartId(cart_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ order })
  } catch (error) {
    throw error
  }
}
