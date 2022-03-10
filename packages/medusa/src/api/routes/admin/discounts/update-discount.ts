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
import {
  DiscountConditionOperator,
  DiscountConditionType,
} from "../../../../models/discount-condition"
import DiscountService from "../../../../services/discount"
import { FindConfig } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
import { IsGreaterThan } from "../../../../utils/validators/greater-than"
import { IsISO8601Duration } from "../../../../utils/validators/iso8601-duration"

/**
 * @oas [post] /discounts/{id}
 * operationId: "PostDiscountsDiscount"
 * summary: "Update a Discount"
 * description: "Updates a Discount with a given set of rules that define how the Discount behaves."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Discount.
 * requestBody:
 *   content:
 *     application/json:
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
 *             type: Date
 *             description: The time at which the Discount should be available.
 *           ends_at:
 *             type: Date
 *             description: The time at which the Discount should no longer be available.
 *           regions:
 *             description: A list of Region ids representing the Regions in which the Discount can be used.
 *             type: array
 *             items:
 *               type: string
 *            metadata:
 *              description: An object containing metadata of the discount
 *              type: object
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

  const validated = await validator(AdminPostDiscountsDiscountReq, req.body)

  const validatedParams = await validator(
    AdminPostDiscountsDiscountParams,
    req.query
  )

  const discountService: DiscountService = req.scope.resolve("discountService")

  await discountService.update(discount_id, validated)

  let includeFields: string[] = []
  if (validatedParams.fields) {
    includeFields = validatedParams.fields!.split(",")
  }

  let expandFields: string[] = []
  if (validatedParams.expand) {
    expandFields = validatedParams.expand!.split(",")
  }

  const retrieveConfig: FindConfig<Discount> = {
    select: (includeFields.length
      ? includeFields
      : defaultAdminDiscountsFields) as (keyof Discount)[],
    relations: expandFields.length
      ? expandFields
      : defaultAdminDiscountsRelations,
  }

  const discount = await discountService.retrieve(discount_id, retrieveConfig)

  res.status(200).json({ discount })
}

export class AdminPostDiscountsDiscountReq {
  @IsString()
  @IsOptional()
  code?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => AdminUpdateDiscountRule)
  rule?: AdminUpdateDiscountRule

  @IsBoolean()
  @IsOptional()
  is_dynamic?: boolean

  @IsBoolean()
  @IsOptional()
  is_disabled?: boolean

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

export class AdminUpdateDiscountRule {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  type: string

  @IsNumber()
  value: string

  @IsString()
  @IsNotEmpty()
  allocation: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminUpsertCondition)
  conditions?: AdminUpsertCondition[]
}

export class AdminUpsertCondition {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  operator?: DiscountConditionOperator

  @IsString()
  resource_type: DiscountConditionType

  @IsArray()
  @IsString({ each: true })
  resource_ids: string[]
}

export class AdminPostDiscountsDiscountParams {
  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
