import { Request, Response } from "express"
import { AllocationType, DiscountConditionOperator } from "../../../../models"
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
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /admin/discounts/{id}
 * operationId: "PostDiscountsDiscount"
 * summary: "Update a Discount"
 * description: "Update a Discount with a given set of rules that define how the Discount is applied."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Discount.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned discount.
 *   - (query) fields {string} Comma-separated fields that should be retrieved in the returned discount.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostDiscountsDiscountReq"
 * x-codegen:
 *   method: update
 *   queryParams: AdminPostDiscountsDiscountParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.discounts.update(discountId, {
 *         code: "TEST"
 *       })
 *       .then(({ discount }) => {
 *         console.log(discount.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST 'https://medusa-url.com/admin/discounts/{id}' \
 *       -H 'Authorization: Bearer {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "code": "TEST"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Discounts
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
  const { discount_id } = req.params

  const discountService: DiscountService = req.scope.resolve("discountService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await discountService
      .withTransaction(transactionManager)
      .update(discount_id, req.validatedBody as AdminPostDiscountsDiscountReq)
  })

  const discount = await discountService.retrieve(
    discount_id,
    req.retrieveConfig
  )

  res.status(200).json({ discount })
}

/**
 * @schema AdminPostDiscountsDiscountReq
 * type: object
 * properties:
 *   code:
 *     type: string
 *     description: A unique code that will be used to redeem the discount
 *   rule:
 *     description: The discount rule that defines how discounts are calculated
 *     type: object
 *     required:
 *       - id
 *     properties:
 *       id:
 *         type: string
 *         description: "The ID of the Rule"
 *       description:
 *         type: string
 *         description: "A short description of the discount"
 *       value:
 *         type: number
 *         description: "The value that the discount represents. This will depend on the type of the discount."
 *       allocation:
 *         type: string
 *         description: "The scope that the discount should apply to. `total` indicates that the discount should be applied on the cart total, and `item` indicates that the discount should be applied to each discountable item in the cart."
 *         enum: [total, item]
 *       conditions:
 *         type: array
 *         description: "A set of conditions that can be used to limit when the discount can be used. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups` should be provided based on the discount condition's type."
 *         items:
 *           type: object
 *           required:
 *             - operator
 *           properties:
 *             id:
 *               type: string
 *               description: "The ID of the condition"
 *             operator:
 *               type: string
 *               description: "Operator of the condition. `in` indicates that discountable resources are within the specified resources. `not_in` indicates that
 *                discountable resources are everything but the specified resources."
 *               enum: [in, not_in]
 *             products:
 *               type: array
 *               description: list of product IDs if the condition's type is `products`.
 *               items:
 *                 type: string
 *             product_types:
 *               type: array
 *               description: list of product type IDs if the condition's type is `product_types`.
 *               items:
 *                 type: string
 *             product_collections:
 *               type: array
 *               description: list of product collection IDs if the condition's type is `product_collections`.
 *               items:
 *                 type: string
 *             product_tags:
 *               type: array
 *               description: list of product tag IDs if the condition's type is `product_tags`.
 *               items:
 *                 type: string
 *             customer_groups:
 *               type: array
 *               description: list of customer group IDs if the condition's type is `customer_groups`.
 *               items:
 *                 type: string
 *   is_disabled:
 *     type: boolean
 *     description: Whether the discount code is disabled on creation. If set to `true`, it will not be available for customers.
 *   starts_at:
 *     type: string
 *     format: date-time
 *     description: The date and time at which the discount should be available.
 *   ends_at:
 *     type: string
 *     format: date-time
 *     description: The date and time at which the discount should no longer be available.
 *   valid_duration:
 *     type: string
 *     description: The duration the discount runs between
 *     example: P3Y6M4DT12H30M5S
 *   usage_limit:
 *     type: number
 *     description: Maximum number of times the discount can be used
 *   regions:
 *     description: A list of region IDs representing the Regions in which the Discount can be used.
 *     type: array
 *     items:
 *       type: string
 *   metadata:
 *      description: An object containing metadata of the discount
 *      type: object
 */
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
  is_disabled?: boolean

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  starts_at?: Date

  @IsDate()
  @IsOptional()
  @IsGreaterThan("starts_at")
  @Type(() => Date)
  ends_at?: Date | null

  @IsISO8601Duration()
  @IsOptional()
  valid_duration?: string | null

  @IsNumber()
  @IsOptional()
  @IsPositive()
  usage_limit?: number | null

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

  @IsNumber()
  @IsOptional()
  value?: number

  @IsOptional()
  @IsEnum(AllocationType, {
    message: `Invalid allocation type, must be one of "total" or "item"`,
  })
  allocation?: AllocationType

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminUpsertCondition)
  conditions?: AdminUpsertCondition[]
}

export class AdminUpsertCondition extends AdminUpsertConditionsReq {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  operator: DiscountConditionOperator
}

export class AdminPostDiscountsDiscountParams extends FindParams {}
