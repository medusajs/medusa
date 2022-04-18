import { Transform, Type } from "class-transformer"
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import _, { pickBy } from "lodash"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import { Discount } from "../../../.."
import DiscountService from "../../../../services/discount"
import { FindConfig } from "../../../../types/common"
import { AdminGetDiscountsDiscountRuleParams } from "../../../../types/discount"
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

  const relations =
    validated.expand?.split(",") ?? defaultAdminDiscountsRelations

  const listConfig: FindConfig<Discount> = {
    select: defaultAdminDiscountsFields,
    relations,
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

export class AdminGetDiscountsParams {
  @ValidateNested()
  @IsOptional()
  @Type(() => AdminGetDiscountsDiscountRuleParams)
  rule?: AdminGetDiscountsDiscountRuleParams

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
