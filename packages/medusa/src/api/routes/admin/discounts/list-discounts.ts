import { Type, Transform } from "class-transformer"
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import _, { pickBy } from "lodash"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import {
  AllocationType,
  DiscountRuleType,
} from "../../../../models/discount-rule"
import DiscountService from "../../../../services/discount"
import { DateComparisonOperator } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
/**
 * @oas [get] /discounts
 * operationId: "GetDiscounts"
 * summary: "List Discounts"
 * x-authenticated: true
 * description: "Retrieves a list of Discounts"
 * parameters:
 *   - (query) q {string} Search query applied on results.
 *   - (query) is_dynamic {boolean} Return only dynamic discounts.
 *   - (query) is_disabled {boolean} Return only disabled discounts.
 *   - (query) limit {number} The number of items in the response
 *   - (query) offset {number} The offset of items in response
 *   - (query) expand {string} Comma separated list of relations to include in the results.
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

  const listConfig = {
    select: defaultAdminDiscountsFields,
    relations: defaultAdminDiscountsRelations,
    skip: validated.offset,
    take: validated.limit,
    order: { created_at: "DESC" },
  }

  const filterableFields = _.omit(validated, ["limit", "offset", "expand"])

  const [discounts, count] = await discountService.listAndCount(
    pickBy(filterableFields, (val) => typeof val !== "undefined"),
    listConfig
  )

  res.status(200).json({
    discounts,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

class AdminGetDiscountsDiscountRuleParams {
  @IsOptional()
  @IsEnum(DiscountRuleType)
  type: DiscountRuleType

  @IsOptional()
  @IsEnum(AllocationType)
  allocation: AllocationType
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

  @ValidateNested()
  @IsOptional()
  @Type(() => AdminGetDiscountsDiscountRuleParams)
  rule?: AdminGetDiscountsDiscountRuleParams

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit = 20

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @IsString()
  @IsOptional()
  expand?: string
}
