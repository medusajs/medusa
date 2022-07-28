import DiscountService from "../../../../services/discount"

/**
 * @oas [delete] /discounts/{id}
 * operationId: "DeleteDiscountsDiscount"
 * summary: "Delete a Discount"
 * description: "Deletes a Discount."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Discount
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
 *               description: The ID of the deleted Discount
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: discount
 *             deleted:
 *               type: boolean
 *               description: Whether the discount was deleted successfully or not.
 */
export default async (req, res) => {
  const { discount_id } = req.params

  const discountService: DiscountService = req.scope.resolve("discountService")
  await discountService.delete(discount_id)

  res.json({
    id: discount_id,
    object: "discount",
    deleted: true,
  })
}
