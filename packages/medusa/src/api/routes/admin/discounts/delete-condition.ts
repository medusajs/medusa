import DiscountConditionService from "../../../../services/discount-condition"
import { DiscountService } from "../../../../services"
import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { FindParams } from "../../../../types/common"

/**
 * @oas [delete] /discounts/{discount_id}/conditions/{condition_id}
 * operationId: "DeleteDiscountsDiscountConditionsCondition"
 * summary: "Delete a Condition"
 * description: "Deletes a DiscountCondition"
 * x-authenticated: true
 * parameters:
 *   - (path) discount_id=* {string} The ID of the Discount
 *   - (path) condition_id=* {string} The ID of the DiscountCondition
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
 * x-codegen:
 *   method: deleteCondition
 *   queryParams: AdminDeleteDiscountsDiscountConditionsConditionParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.discounts.deleteCondition(discount_id, condition_id)
 *       .then(({ id, object, deleted }) => {
 *         console.log(id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/discounts/{id}/conditions/{condition_id}' \
 *       --header 'Authorization: Bearer {api_token}'
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
 *           $ref: "#/components/schemas/AdminDiscountConditionsDeleteRes"
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
export default async (req, res) => {
  const { discount_id, condition_id } = req.params

  const conditionService: DiscountConditionService = req.scope.resolve(
    "discountConditionService"
  )
  const discountService: DiscountService = req.scope.resolve("discountService")

  const condition = await conditionService
    .retrieve(condition_id)
    .catch(() => void 0)

  if (!condition) {
    const discount = await discountService.retrieve(
      discount_id,
      req.retrieveConfig
    )
    // resolves idempotently in case of non-existing condition
    return res.json({
      id: condition_id,
      object: "discount-condition",
      deleted: true,
      discount,
    })
  }

  let discount = await discountService.retrieve(discount_id, {
    select: ["id", "rule_id"],
  })

  if (condition.discount_rule_id !== discount.rule_id) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Condition with id ${condition_id} does not belong to Discount with id ${discount_id}`
    )
  }

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await conditionService
      .withTransaction(transactionManager)
      .delete(condition_id)
  })

  discount = await discountService.retrieve(discount_id, req.retrieveConfig)

  res.json({
    id: condition_id,
    object: "discount-condition",
    deleted: true,
    discount,
  })
}

export class AdminDeleteDiscountsDiscountConditionsConditionParams extends FindParams {}
