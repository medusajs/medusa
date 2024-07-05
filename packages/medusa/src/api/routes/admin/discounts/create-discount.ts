import { Type } from "class-transformer"
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
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import {
  AllocationType,
  DiscountConditionOperator,
  DiscountRuleType,
} from "../../../../models"
import DiscountService from "../../../../services/discount"
import { FindParams } from "../../../../types/common"
import { AdminUpsertConditionsReq } from "../../../../types/discount"
import { IsGreaterThan } from "../../../../utils/validators/greater-than"
import { IsISO8601Duration } from "../../../../utils/validators/iso8601-duration"

/**
 * @oas [post] /admin/discounts
 * operationId: "PostDiscounts"
 * summary: "Create a Discount"
 * x-authenticated: true
 * description: "Create a Discount with a given set of rules that defines how the Discount is applied."
 * parameters:
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned discount.
 *   - (query) fields {string} Comma-separated fields that should be retrieved in the returned discount.
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
 *         code: "TEST",
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
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import {
 *         useAdminCreateDiscount,
 *       } from "medusa-react"
 *       import {
 *         AllocationType,
 *         DiscountRuleType,
 *       } from "@medusajs/medusa"
 *
 *       const CreateDiscount = () => {
 *         const createDiscount = useAdminCreateDiscount()
 *         // ...
 *
 *         const handleCreate = (
 *           currencyCode: string,
 *           regionId: string
 *         ) => {
 *           // ...
 *           createDiscount.mutate({
 *             code: currencyCode,
 *             rule: {
 *               type: DiscountRuleType.FIXED,
 *               value: 10,
 *               allocation: AllocationType.ITEM,
 *             },
 *             regions: [
 *                 regionId,
 *             ],
 *             is_dynamic: false,
 *             is_disabled: false,
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default CreateDiscount
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/discounts' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
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
 *   - jwt_token: []
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
 * Details of the discount rule to create.
 */
export class AdminPostDiscountsDiscountRule {
  /**
   * The discount rule's description.
   */
  @IsString()
  @IsOptional()
  description?: string

  /**
   * The discount rule's type.
   */
  @IsEnum(DiscountRuleType, {
    message: `Invalid rule type, must be one of "fixed", "percentage" or "free_shipping"`,
  })
  type: DiscountRuleType

  /**
   * The discount rule's value.
   */
  @IsNumber()
  value: number

  /**
   * The discount rule's allocation.
   */
  @IsEnum(AllocationType, {
    message: `Invalid allocation type, must be one of "total" or "item"`,
  })
  allocation: AllocationType

  /**
   * The discount rule's conditions.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminCreateCondition)
  conditions?: AdminCreateCondition[]
}

/**
 * @schema AdminPostDiscountsReq
 * type: object
 * description: "The details of the discount to create."
 * required:
 *   - code
 *   - rule
 *   - regions
 * properties:
 *   code:
 *     type: string
 *     description: A unique code that will be used to redeem the discount
 *   is_dynamic:
 *     type: boolean
 *     description: Whether the discount should have multiple instances of itself, each with a different code. This can be useful for automatically generated discount codes that all have to follow a common set of rules.
 *     default: false
 *   rule:
 *     description: The discount rule that defines how discounts are calculated
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
 *         description: >-
 *           The type of the discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers.
 *         enum: [fixed, percentage, free_shipping]
 *       value:
 *         type: number
 *         description: "The value that the discount represents. This will depend on the type of the discount."
 *       allocation:
 *         type: string
 *         description: >-
 *           The scope that the discount should apply to. `total` indicates that the discount should be applied on the cart total, and `item` indicates that the discount should be applied to each discountable item in the cart.
 *         enum: [total, item]
 *       conditions:
 *         type: array
 *         description: "A set of conditions that can be used to limit when the discount can be used. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups` should be provided based on the discount condition's type."
 *         items:
 *           type: object
 *           required:
 *              - operator
 *           properties:
 *             operator:
 *               type: string
 *               description: >-
 *                 Operator of the condition. `in` indicates that discountable resources are within the specified resources. `not_in` indicates that
 *                 discountable resources are everything but the specified resources.
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
 *     description: >-
 *       Whether the discount code is disabled on creation. If set to `true`, it will not be available for customers.
 *     default: false
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
 *   regions:
 *     description: A list of region IDs representing the Regions in which the Discount can be used.
 *     type: array
 *     items:
 *       type: string
 *   usage_limit:
 *     type: number
 *     description: Maximum number of times the discount can be used
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
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

/**
 * Details of the discount condition to create.
 */
export class AdminCreateCondition extends AdminUpsertConditionsReq {
  /**
   * The operator of the discount condition.
   */
  @IsString()
  operator: DiscountConditionOperator
}

/**
 * {@inheritDoc FindParams}
 */
export class AdminPostDiscountsParams extends FindParams {}
