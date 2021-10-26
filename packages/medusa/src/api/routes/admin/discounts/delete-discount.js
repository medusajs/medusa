/**
 * @oas [delete] /discounts/{id}
 * operationId: "DeleteDiscountsDiscount"
 * summary: "Delete a Discount"
 * description: "Deletes a Discount."
 * parameters:
 *   - (path) id=* {string} The id of the Discount
 * tags:
 *   - Discount
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The id of the deleted Discount
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */
export default async (req, res) => {
  const { discount_id } = req.params
  const discountService = req.scope.resolve("discountService")
  await discountService.delete(discount_id)

  res.json({
    id: discount_id,
    object: "discount",
    deleted: true,
  })
}
