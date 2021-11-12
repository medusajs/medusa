import { defaultAdminDiscountsRelations } from "."
import { IsNotEmpty, IsString } from "class-validator"
import DiscountService from "../../../../services/discount"
import { validator } from "../../../../utils/validator"
/**
 * @oas [get] /discounts/code/{code}
 * operationId: "GetDiscountsDiscountCode"
 * summary: "Retrieve a Discount by code"
 * description: "Retrieves a Discount by its discount code"
 * x-authenticated: true
 * parameters:
 *   - (path) code=* {string} The code of the Discount
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
  const { code } = await validator(
    AdminGetDiscountsDiscountCodeParams,
    req.params
  )
  const discountService: DiscountService = req.scope.resolve("discountService")
  const discount = await discountService.retrieveByCode(
    code,
    defaultAdminDiscountsRelations
  )

  res.status(200).json({ discount })
}

export class AdminGetDiscountsDiscountCodeParams {
  @IsString()
  @IsNotEmpty()
  code: string
}
