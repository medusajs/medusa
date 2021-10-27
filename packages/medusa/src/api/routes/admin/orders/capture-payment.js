import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /orders/{id}/capture
 * operationId: "PostOrdersOrderCapture"
 * summary: "Capture an Order"
 * description: "Captures all the Payments associated with an Order."
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

  const orderService = req.scope.resolve("orderService")

  await orderService.capturePayment(id)

  const order = await orderService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.json({ order })
}
