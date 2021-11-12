import { IsNotEmpty, IsString } from "class-validator"
import DiscountService from "../../../../services/discount"
import { validator } from "../../../../utils/validator"

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
export default async (req, res) => {
  const { discount_id, code } = await validator(
    AdminDeleteDiscountsDiscountDynamicCodesCodeParams,
    req.params
  )
  const discountService: DiscountService = req.scope.resolve("discountService")
  await discountService.deleteDynamicCode(discount_id, code)

  const discount = await discountService.retrieve(discount_id, {
    relations: ["rule", "rule.valid_for", "regions"],
  })

  res.status(200).json({ discount })
}

export class AdminDeleteDiscountsDiscountDynamicCodesCodeParams {
  @IsString()
  @IsNotEmpty()
  discount_id: string

  @IsString()
  @IsNotEmpty()
  code: string
}
