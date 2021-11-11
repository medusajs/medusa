import { Type } from "class-transformer"
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"
import { defaultFields, defaultRelations } from "."
import { Discount } from "../../../.."
import DiscountService from "../../../../services/discount"
import { validator } from "../../../../utils/validator"
/**
 * @oas [get] /discounts
 * operationId: "GetDiscounts"
 * summary: "List Discounts"
 * x-authenticated: true
 * description: "Retrieves a list of Discounts"
 * parameters:
 *   - (path) q {string} Search query applied on results.
 *   - (path) is_dynamic {boolean} Return only dynamic discounts.
 *   - (path) is_disabled {boolean} Return only disabled discounts.
 *   - (path) limit {number} The number of items in the response
 *   - (path) offset {number} The offset of items in response
 *   - (path) expand {string} Comma separated list of relations to include in the results.
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
  const validated = await validator(AdminGetDiscountsReq, req.query)

  const discountService: DiscountService = req.scope.resolve("discountService")
  const limit = validated.limit || 20
  const offset = validated.offset || 0
  const selector: GetDiscountsConfig = {}

  if (validated.q) {
    selector.q = validated.q
  }

  selector.is_dynamic = validated.is_dynamic
  selector.is_disabled = validated.is_disabled

  const listConfig = {
    select: defaultFields,
    relations: defaultRelations,
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  }

  const [discounts, count] = await discountService.listAndCount(
    selector,
    listConfig
  )

  res.status(200).json({ discounts, count, offset, limit })
}

export type GetDiscountsConfig = {
  q?: string
  is_dynamic?: boolean
  is_disabled?: boolean
}

export class AdminGetDiscountsReq {
  @IsString()
  @IsOptional()
  q?: string

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  is_dynamic?: boolean = false

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  is_disabled?: boolean = false

  @IsNumber()
  @IsOptional()
  limit?: number

  @IsNumber()
  @IsOptional()
  offset?: number

  @IsString()
  @IsOptional()
  expand?: string
}
