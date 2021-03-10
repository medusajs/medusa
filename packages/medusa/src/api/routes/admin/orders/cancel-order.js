/**
 * @oas [post] /orders/{id}/cancel
 * operationId: "PostOrdersOrderCancel"
 * summary: "Cancel an Order"
 * description: "Registers an Order as canceled. This triggers a flow that will cancel any created Fulfillments and Payments, may fail if the Payment or Fulfillment Provider is unable to cancel the Payment/Fulfillment."
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

  try {
    const orderService = req.scope.resolve("orderService")

    await orderService.cancel(id)

    const order = await orderService.retrieve(id, {
      relations: ["region", "customer", "swaps"],
    })

    res.json({ order })
  } catch (error) {
    throw error
  }
}
