import { IsOptional, IsString } from "class-validator"
import { MedusaError } from "medusa-core-utils"
import {
  defaultAdminDiscountConditionFields,
  defaultAdminDiscountConditionRelations,
} from "."
import { DiscountCondition } from "../../../../models"
import { DiscountService } from "../../../../services"
import DiscountConditionService from "../../../../services/discount-condition"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"
/**
 * @oas [get] /discounts/{discount_id}/conditions/{condition_id}
 * operationId: "GetDiscountsDiscountConditionsCondition"
 * summary: "Gets a DiscountCondition"
 * x-authenticated: true
 * parameters:
 *   - (path) discount_id=* {string} The id of the Discount.
 *   - (path) condition_id=* {string} The id of the DiscountCondition.
 * query:
 *  - (query) expand {string} Comma separated list of relations to include in the results.
 *  - (query) fields {string} Comma separated list of fields to include in the results.
 * description: "Gets a DiscountCondition"
 
 * tags:
 *   - DiscountCondition
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             discount_condition:
 *               $ref: "#/components/schemas/discount_condition"
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
