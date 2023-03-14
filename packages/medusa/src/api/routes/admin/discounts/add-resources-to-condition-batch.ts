import DiscountConditionService from "../../../../services/discount-condition"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { DiscountService } from "../../../../services"
import {
  DiscountConditionInput,
  DiscountConditionMapTypeToProperty,
} from "../../../../types/discount"
import { IsArray } from "class-validator"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /discounts/{discount_id}/conditions/{condition_id}/batch
 * operationId: "PostDiscountsDiscountConditionsConditionBatch"
 * summary: "Add Batch Resources"
 * description: "Add a batch of resources to a discount condition."
 * x-authenticated: true
 * parameters:
 *   - (path) discount_id=* {string} The ID of the Product.
 *   - (path) condition_id=* {string} The ID of the condition on which to add the item.
 *   - (query) expand {string} (Comma separated) Which relations should be expanded in each discount of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each discount of the result.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostDiscountsDiscountConditionsConditionBatchReq"
 * x-codegen:
 *   method: addConditionResourceBatch
 *   queryParams: AdminPostDiscountsDiscountConditionsConditionBatchParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.discounts.addConditionResourceBatch(discount_id, condition_id, {
 *         resources: [{ id: item_id }]
 *       })
 *       .then(({ discount }) => {
 *         console.log(discount.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/discounts/{id}/conditions/{condition_id}/batch' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "resources": [{ "id": "item_id" }]
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
  const { discount_id, condition_id } = req.params
  const validatedBody =
    req.validatedBody as AdminPostDiscountsDiscountConditionsConditionBatchReq

  const conditionService: DiscountConditionService = req.scope.resolve(
    "discountConditionService"
  )
  const manager: EntityManager = req.scope.resolve("manager")

  const condition = await conditionService.retrieve(condition_id, {
    select: ["id", "type", "discount_rule_id"],
  })

  const updateObj: DiscountConditionInput = {
    id: condition_id,
    rule_id: condition.discount_rule_id,
    [DiscountConditionMapTypeToProperty[condition.type]]:
      validatedBody.resources,
  }

  await manager.transaction(async (transactionManager) => {
    await conditionService
      .withTransaction(transactionManager)
      .upsertCondition(updateObj, false)
  })

  const discountService: DiscountService = req.scope.resolve("discountService")
  const discount = await discountService.retrieve(
    discount_id,
    req.retrieveConfig
  )

  res.status(200).json({ discount })
}

/**
 * @schema AdminPostDiscountsDiscountConditionsConditionBatchReq
 * type: object
 * required:
 *   - resources
 * properties:
 *   resources:
 *     description: The resources to be added to the discount condition
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           description: The id of the item
 *           type: string
 */
export class AdminPostDiscountsDiscountConditionsConditionBatchReq {
  @IsArray()
  resources: { id: string }[]
}

// eslint-disable-next-line max-len
export class AdminPostDiscountsDiscountConditionsConditionBatchParams extends FindParams {}
