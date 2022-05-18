import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import { Discount } from "../../../../models/discount"
import { DiscountConditionOperator } from "../../../../models/discount-condition"
import DiscountService from "../../../../services/discount"
import { AdminUpsertConditionsReq } from "../../../../types/discount"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"
import { IsGreaterThan } from "../../../../utils/validators/greater-than"
import { IsISO8601Duration } from "../../../../utils/validators/iso8601-duration"
import { AdminPostDiscountsDiscountParams } from "./update-discount"
/**
 * @oas [post] /discounts
 * operationId: "PostDiscounts"
 * summary: "Creates a Discount"
 * x-authenticated: true
 * description: "Creates a Discount with a given set of rules that define how the Discount behaves."
 * requestBody:
 *   content:
 *     application/json:
 *       required:
 *         - code
 *         - rule
 *       schema:
 *         properties:
 *           code:
 *             type: string
 *             description: A unique code that will be used to redeem the Discount
 *           is_dynamic:
 *             type: string
 *             description: Whether the Discount should have multiple instances of itself, each with a different code. This can be useful for automatically generated codes that all have to follow a common set of rules.
 *           rule:
 *             description: The Discount Rule that defines how Discounts are calculated
 *             oneOf:
 *               - $ref: "#/components/schemas/discount_rule"
 *           is_disabled:
 *             type: boolean
 *             description: Whether the Discount code is disabled on creation. You will have to enable it later to make it available to Customers.
 *           starts_at:
 *             type: string
 *             format: date-time
 *             description: The time at which the Discount should be available.
 *           ends_at:
 *             type: string
 *             format: date-time
 *             description: The time at which the Discount should no longer be available.
 *           regions:
 *             description: A list of Region ids representing the Regions in which the Discount can be used.
 *             type: array
 *             items:
 *               type: string
 *           usage_limit:
 *             type: number
 *             description: Maximum times the discount can be used
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
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
  const validated = await validator(AdminPostDiscountsReq, req.body)

  console.log(validated.rule.conditions)

  const validatedParams = await validator(
    AdminPostDiscountsDiscountParams,
    req.query
  )

  const discountService: DiscountService = req.scope.resolve("discountService")

  const created = await discountService.create(validated)

  const config = getRetrieveConfig<Discount>(
    defaultAdminDiscountsFields,
    defaultAdminDiscountsRelations,
    validatedParams?.fields?.split(",") as (keyof Discount)[],
    validatedParams?.expand?.split(",")
  )

  const discount = await discountService.retrieve(created.id, config)

  res.status(200).json({ discount })
}

export class AdminPostDiscountsReq {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AdminPostDiscountsDiscountRule)
  rule: AdminPostDiscountsDiscountRule

  @IsBoolean()
  @IsOptional()
  is_dynamic = false

  @IsBoolean()
  @IsOptional()
  is_disabled = false

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  starts_at?: Date

  @IsDate()
  @IsOptional()
  @IsGreaterThan("starts_at")
  @Type(() => Date)
  ends_at?: Date

  @IsISO8601Duration()
  @IsOptional()
  valid_duration?: string

  @IsNumber()
  @IsOptional()
  @IsPositive()
  usage_limit?: number

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  regions?: string[]

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostDiscountsDiscountRule {
  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  type: string

  @IsNumber()
  value: number

  @IsString()
  @IsNotEmpty()
  allocation: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminCreateCondition)
  conditions?: AdminCreateCondition[]
}

export class AdminCreateCondition extends AdminUpsertConditionsReq {
  @IsString()
  operator: DiscountConditionOperator
}

export class AdminPostDiscountsParams {
  @IsArray()
  @IsOptional()
  expand?: string[]

  @IsArray()
  @IsOptional()
  fields?: string[]
}
