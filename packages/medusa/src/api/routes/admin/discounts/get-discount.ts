import { IsNotEmpty, IsString } from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import DiscountService from "../../../../services/discount"
import { validator } from "../../../../utils/validator"
/**
 * @oas [get] /discounts/{id}
 * operationId: "GetDiscountsDiscount"
 * summary: "Retrieve a Discount"
 * description: "Retrieves a Discount"
 * x-authenticated: true
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
 *             discount:
 *               $ref: "#/components/schemas/discount"
 */
export default async (req, res) => {
  const { discount_id } = await validator(
    AdminGetDiscountsDiscountReq,
    req.params
  )
  const discountService: DiscountService = req.scope.resolve("discountService")
  const data = await discountService.retrieve(discount_id, {
    select: defaultAdminDiscountsFields,
    relations: defaultAdminDiscountsRelations,
  })

  res.status(200).json({ discount: data })
}

export class AdminGetDiscountsDiscountReq {
  @IsString()
  @IsNotEmpty()
  discount_id: string
}
