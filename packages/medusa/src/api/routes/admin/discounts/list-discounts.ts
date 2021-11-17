import { Type, Transform } from "class-transformer"
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import DiscountService from "../../../../services/discount"
import { ListSelector } from "../../../../types/discount"
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
  const validated = await validator(AdminGetDiscountsParams, req.query)

  const discountService: DiscountService = req.scope.resolve("discountService")
  const selector: ListSelector = {}

  if (validated.q) {
    selector.q = validated.q
  }

  selector.is_disabled = validated.is_disabled
  selector.is_dynamic = validated.is_dynamic

  const listConfig = {
    select: defaultAdminDiscountsFields,
    relations: defaultAdminDiscountsRelations,
    skip: validated.offset,
    take: validated.limit,
    order: { created_at: "DESC" },
  }
  const [discounts, count] = await discountService.listAndCount(
    selector,
    listConfig
  )

  res.status(200).json({
    discounts,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetDiscountsParams {
  @IsString()
  @IsOptional()
  q?: string

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  is_dynamic?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  is_disabled?: boolean

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 20

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @IsString()
  @IsOptional()
  expand?: string
}
