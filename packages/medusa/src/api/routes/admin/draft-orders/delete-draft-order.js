/**
 * @oas [delete] /draft-orders/{id}
 * operationId: DeleteDraftOrdersDraftOrder
 * summary: Delete a Draft Order
 * description: "Deletes a Draft Order"
 * parameters:
 *   - (path) id=* {string} The id of the Draft Order.
 * tags:
 *   - Draft Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The id of the deleted Draft Order.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */

export default async (req, res) => {
  const { id } = req.params

  const draftOrderService = req.scope.resolve("draftOrderService")
  await draftOrderService.delete(id)

  res.json({
    id,
    object: "draft-order",
    deleted: true,
  })
}
