import { Request } from "@interfaces/http"
import DiscountService from "../../../../services/discount"

/**
 * @oas [delete] /discounts/{id}/dynamic-codes/{code}
 * operationId: "DeleteDiscountsDiscountDynamicCodesCode"
 * summary: "Delete a dynamic code"
 * description: "Deletes a dynamic code from a Discount."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Discount
 *   - (path) code=* {string} The id of the Discount
 * tags:
 *   - Discount
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             discount:
 *               $ref: "#/components/schemas/discount"
 */
export default async (req: Request, res) => {
  const { discount_id, code } = req.params

  const discountService: DiscountService = req.scope.resolve("discountService")
  await discountService.deleteDynamicCode(discount_id, code)

  const discount = await discountService.retrieve(discount_id, {
    relations: ["rule", "rule.valid_for", "regions"],
  })

  res.status(200).json({ discount })
}
