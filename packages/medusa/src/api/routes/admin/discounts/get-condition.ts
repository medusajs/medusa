import { IsOptional, IsString } from "class-validator"
import {
  defaultAdminDiscountConditionFields,
  defaultAdminDiscountConditionRelations,
} from "."

import { DiscountCondition } from "../../../../models"
import DiscountConditionService from "../../../../services/discount-condition"
import { DiscountService } from "../../../../services"
import { MedusaError } from "medusa-core-utils"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /discounts/{discount_id}/conditions/{condition_id}
 * operationId: "GetDiscountsDiscountConditionsCondition"
 * summary: "Gets a DiscountCondition"
 * description: "Gets a DiscountCondition"
 * x-authenticated: true
 * parameters:
 *   - (path) discount_id=* {string} The ID of the Discount.
 *   - (path) condition_id=* {string} The ID of the DiscountCondition.
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
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
 *   - Discount Condition
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             discount_condition:
 *               $ref: "#/components/schemas/discount_condition"
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

  const validatedParams = await validator(
    AdminGetDiscountsDiscountConditionsConditionParams,
    req.query
  )

  const discountService: DiscountService = req.scope.resolve("discountService")

  const discount = await discountService.retrieve(discount_id, {
    relations: ["rule", "rule.conditions"],
  })

  const existsOnDiscount = discount.rule.conditions.some(
    (c) => c.id === condition_id
  )

  if (!existsOnDiscount) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Condition with id ${condition_id} does not belong to Discount with id ${discount_id}`
    )
  }

  const config = getRetrieveConfig<DiscountCondition>(
    defaultAdminDiscountConditionFields,
    defaultAdminDiscountConditionRelations,
    validatedParams?.fields?.split(",") as (keyof DiscountCondition)[],
    validatedParams?.expand?.split(",")
  )

  const conditionService: DiscountConditionService = req.scope.resolve(
    "discountConditionService"
  )

  const discountCondition = await conditionService.retrieve(
    condition_id,
    config
  )

  res.status(200).json({ discount_condition: discountCondition })
}

export class AdminGetDiscountsDiscountConditionsConditionParams {
  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
