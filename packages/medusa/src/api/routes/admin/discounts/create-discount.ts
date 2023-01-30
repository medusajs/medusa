import {
  AllocationType,
  DiscountConditionOperator,
  DiscountRuleType,
} from "../../../../models"
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator"
import { AdminUpsertConditionsReq } from "../../../../types/discount"
import DiscountService from "../../../../services/discount"
import { EntityManager } from "typeorm"
import { IsGreaterThan } from "../../../../utils/validators/greater-than"
import { IsISO8601Duration } from "../../../../utils/validators/iso8601-duration"
import { Type } from "class-transformer"
import { Request, Response } from "express"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /discounts
 * operationId: "PostDiscounts"
 * summary: "Creates a Discount"
 * x-authenticated: true
 * description: "Creates a Discount with a given set of rules that define how the Discount behaves."
 * parameters:
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in the results.
 *   - (query) fields {string} (Comma separated) Which fields should be retrieved in the results.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostDiscountsReq"
 * x-codegen:
 *   method: create
 *   queryParams: AdminPostDiscountsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       import { AllocationType, DiscountRuleType } from "@medusajs/medusa"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.discounts.create({
 *         code: 'TEST',
 *         rule: {
 *           type: DiscountRuleType.FIXED,
 *           value: 10,
 *           allocation: AllocationType.ITEM
 *         },
 *         regions: ["reg_XXXXXXXX"],
 *         is_dynamic: false,
 *         is_disabled: false
 *       })
 *       .then(({ discount }) => {
 *         console.log(discount.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/discounts' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "code": "TEST",
 *           "rule": {
 *              "type": "fixed",
 *              "value": 10,
 *              "allocation": "item"
 *           },
 *           "regions": ["reg_XXXXXXXX"]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Discount
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminDiscountsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */

export default async (req: Request, res: Response) => {
  const discountService: DiscountService = req.scope.resolve("discountService")

  const manager: EntityManager = req.scope.resolve("manager")
  const created = await manager.transaction(async (transactionManager) => {
    return await discountService
      .withTransaction(transactionManager)
      .create(req.validatedBody as AdminPostDiscountsReq)
  })

  const discount = await discountService.retrieve(
    created.id,
    req.retrieveConfig
  )

  res.status(200).json({ discount })
}

/**
 * @schema AdminPostDiscountsReq
 * type: object
 * required:
 *   - code
 *   - rule
 *   - regions
 * properties:
 *   code:
 *     type: string
 *     description: A unique code that will be used to redeem the Discount
 *   is_dynamic:
 *     type: boolean
 *     description: Whether the Discount should have multiple instances of itself, each with a different code. This can be useful for automatically generated codes that all have to follow a common set of rules.
 *     default: false
 *   rule:
 *     description: The Discount Rule that defines how Discounts are calculated
 *     type: object
 *     required:
 *        - type
 *        - value
 *        - allocation
 *     properties:
 *       description:
 *         type: string
 *         description: "A short description of the discount"
 *       type:
 *         type: string
 *         description: "The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers."
 *         enum: [fixed, percentage, free_shipping]
 *       value:
 *         type: number
 *         description: "The value that the discount represents; this will depend on the type of the discount"
 *       allocation:
 *         type: string
 *         description: "The scope that the discount should apply to."
 *         enum: [total, item]
 *       conditions:
 *         type: array
 *         description: "A set of conditions that can be used to limit when  the discount can be used. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups` should be provided."
 *         items:
 *           type: object
 *           required:
 *              - operator
 *           properties:
 *             operator:
 *               type: string
 *               description: Operator of the condition
 *               enum: [in, not_in]
 *             products:
 *               type: array
 *               description: list of product IDs if the condition is applied on products.
 *               items:
 *                 type: string
 *             product_types:
 *               type: array
 *               description: list of product type IDs if the condition is applied on product types.
 *               items:
 *                 type: string
 *             product_collections:
 *               type: array
 *               description: list of product collection IDs if the condition is applied on product collections.
 *               items:
 *                 type: string
 *             product_tags:
 *               type: array
 *               description: list of product tag IDs if the condition is applied on product tags.
 *               items:
 *                 type: string
 *             customer_groups:
 *               type: array
 *               description: list of customer group IDs if the condition is applied on customer groups.
 *               items:
 *                 type: string
 *   is_disabled:
 *     type: boolean
 *     description: Whether the Discount code is disabled on creation. You will have to enable it later to make it available to Customers.
 *     default: false
 *   starts_at:
 *     type: string
 *     format: date-time
 *     description: The time at which the Discount should be available.
 *   ends_at:
 *     type: string
 *     format: date-time
 *     description: The time at which the Discount should no longer be available.
 *   valid_duration:
 *     type: string
 *     description: Duration the discount runs between
 *     example: P3Y6M4DT12H30M5S
 *   regions:
 *     description: A list of Region ids representing the Regions in which the Discount can be used.
 *     type: array
 *     items:
 *       type: string
 *   usage_limit:
 *     type: number
 *     description: Maximum times the discount can be used
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 */
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
  @IsString({ each: true })
  regions: string[]

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostDiscountsDiscountRule {
  @IsString()
  @IsOptional()
  description?: string

  @IsEnum(DiscountRuleType, {
    message: `Invalid rule type, must be one of "fixed", "percentage" or "free_shipping"`,
  })
  type: DiscountRuleType

  @IsNumber()
  value: number

  @IsEnum(AllocationType, {
    message: `Invalid allocation type, must be one of "total" or "item"`,
  })
  allocation: AllocationType

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

export class AdminPostDiscountsParams extends FindParams {}
