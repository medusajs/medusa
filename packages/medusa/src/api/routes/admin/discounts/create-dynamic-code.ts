import { Type } from "class-transformer"
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"
import DiscountService from "../../../../services/discount"
import { validator } from "../../../../utils/validator"
/**
 * @oas [post] /discounts/{id}/dynamic-codes
 * operationId: "PostDiscountsDiscountDynamicCodes"
 * summary: "Create a dynamic Discount code"
 * description: "Creates a unique code that can map to a parent Discount. This is useful if you want to automatically generate codes with the same behaviour."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Discount to create the dynamic code from."
 *   - (body) code=* {string} The unique code that will be used to redeem the Discount.
 *   - (body) ends_at=* {date-time} The time at which the Discount should no longer be available.
 *   - (body) metadata {object} An optional set of key-value paris to hold additional information.
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
  const { discount_id } = req.params

  const validated = await validator(
    AdminPostDiscountsDiscountDynamicCodesReq,
    req.body
  )

  const discountService: DiscountService = req.scope.resolve("discountService")
  const created = await discountService.createDynamicCode(
    discount_id,
    validated
  )

  // TODO: Add conditions relation
  const discount = await discountService.retrieve(created.id, {
    relations: ["rule", "regions"],
  })

  res.status(200).json({ discount })
}

export class AdminPostDiscountsDiscountDynamicCodesReq {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  ends_at?: Date

  @IsNumber()
  @IsOptional()
  usage_limit = 1

  @IsObject()
  @IsOptional()
  metadata?: object
}
