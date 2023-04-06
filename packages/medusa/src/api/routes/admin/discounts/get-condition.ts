import { Request, Response } from "express"
import DiscountConditionService from "../../../../services/discount-condition"
import { FindParams } from "../../../../types/common"

/**
 * @oas [get] /admin/discounts/{discount_id}/conditions/{condition_id}
 * operationId: "GetDiscountsDiscountConditionsCondition"
 * summary: "Get a Condition"
 * description: "Gets a DiscountCondition"
 * x-authenticated: true
 * parameters:
 *   - (path) discount_id=* {string} The ID of the Discount.
 *   - (path) condition_id=* {string} The ID of the DiscountCondition.
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
 * x-codegen:
 *   method: getCondition
 *   queryParams: AdminGetDiscountsDiscountConditionsConditionParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.discounts.getCondition(discount_id, condition_id)
 *       .then(({ discount_condition }) => {
 *         console.log(discount_condition.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/discounts/{id}/conditions/{condition_id}' \
 *       --header 'Authorization: Bearer {api_token}'
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
 *           $ref: "#/components/schemas/AdminDiscountConditionsRes"
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
  const { condition_id } = req.params

  const conditionService: DiscountConditionService = req.scope.resolve(
    "discountConditionService"
  )

  const discountCondition = await conditionService.retrieve(
    condition_id,
    req.retrieveConfig
  )

  res.status(200).json({ discount_condition: discountCondition })
}

export class AdminGetDiscountsDiscountConditionsConditionParams extends FindParams {}
