import { Request, Response } from "express"
import { DiscountConditionOperator } from "../../../../models"
import { IsString } from "class-validator"

import { AdminUpsertConditionsReq } from "../../../../types/discount"
import DiscountConditionService from "../../../../services/discount-condition"
import { DiscountService } from "../../../../services"
import { EntityManager } from "typeorm"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /discounts/{discount_id}/conditions
 * operationId: "PostDiscountsDiscountConditions"
 * summary: "Create a Condition"
 * description: "Creates a DiscountCondition. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups` should be provided."
 * x-authenticated: true
 * parameters:
 *   - (path) discount_id=* {string} The ID of the Product.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each product of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each product of the result.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostDiscountsDiscountConditions"
 * x-codegen:
 *   method: createCondition
 *   queryParams: AdminPostDiscountsDiscountConditionsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       import { DiscountConditionOperator } from "@medusajs/medusa"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.discounts.createCondition(discount_id, {
 *         operator: DiscountConditionOperator.IN
 *       })
 *       .then(({ discount }) => {
 *         console.log(discount.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/discounts/{id}/conditions' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "operator": "in"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Discount Condition
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
  const conditionService: DiscountConditionService = req.scope.resolve(
    "discountConditionService"
  )
  const discountService: DiscountService = req.scope.resolve("discountService")

  let discount = await discountService.retrieve(discount_id)

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await conditionService
      .withTransaction(transactionManager)
      .upsertCondition({
        ...(req.validatedBody as AdminPostDiscountsDiscountConditions),
        rule_id: discount.rule_id,
      })
  })

  discount = await discountService.retrieve(discount.id, req.retrieveConfig)

  res.status(200).json({ discount })
}

/**
 * @schema AdminPostDiscountsDiscountConditions
 * type: object
 * required:
 *   - operator
 * properties:
 *   operator:
 *      description: Operator of the condition
 *      type: string
 *      enum: [in, not_in]
 *   products:
 *      type: array
 *      description: list of product IDs if the condition is applied on products.
 *      items:
 *        type: string
 *   product_types:
 *      type: array
 *      description: list of product type IDs if the condition is applied on product types.
 *      items:
 *        type: string
 *   product_collections:
 *      type: array
 *      description: list of product collection IDs if the condition is applied on product collections.
 *      items:
 *        type: string
 *   product_tags:
 *      type: array
 *      description: list of product tag IDs if the condition is applied on product tags.
 *      items:
 *        type: string
 *   customer_groups:
 *      type: array
 *      description: list of customer group IDs if the condition is applied on customer groups.
 *      items:
 *        type: string
 */
// eslint-disable-next-line max-len
export class AdminPostDiscountsDiscountConditions extends AdminUpsertConditionsReq {
  @IsString()
  operator: DiscountConditionOperator
}

export class AdminPostDiscountsDiscountConditionsParams extends FindParams {}
