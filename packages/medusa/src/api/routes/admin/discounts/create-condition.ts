import { IsOptional, IsString } from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import { Discount } from "../../../../models/discount"
import { DiscountConditionOperator } from "../../../../models/discount-condition"
import { DiscountService } from "../../../../services"
import DiscountConditionService from "../../../../services/discount-condition"
import { AdminUpsertConditionsReq } from "../../../../types/discount"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"
/**
 * @oas [post] /discounts/:id/conditions
 * operationId: "PostDiscountsConditions"
 * summary: "Creates a DiscountCondition"
 * x-authenticated: true
 * description: "Creates a DiscountCondition"
 * requestBody:
 *   content:
 *     application/json:
 *       required:
 *         - id
 *       schema:
 *         properties:
 *           operator:
 *              description: Operator of the condition
 *              type: string
 *           items:
 *              properties:
 *                products:
 *                  type: array
 *                  description: list of products
 *                product_types:
 *                  type: array
 *                  description: list of product types
 *                product_collections:
 *                  type: array
 *                  description: list of product collections
 *                product_tags:
 *                  type: array
 *                  description: list of product tags
 *                customer_groups:
 *                  type: array
 *                  description: list of customer_groups
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

  const validated = await validator(AdminPostDiscountsConditions, req.body)

  const validatedParams = await validator(
    AdminPostDiscountsConditionsParams,
    req.query
  )

  const conditionService: DiscountConditionService = req.scope.resolve(
    "discountConditionService"
  )
  const discountService: DiscountService = req.scope.resolve("discountService")

  await conditionService.upsertCondition(discount_id, validated)

  const config = getRetrieveConfig<Discount>(
    defaultAdminDiscountsFields,
    defaultAdminDiscountsRelations,
    validatedParams?.fields?.split(",") as (keyof Discount)[],
    validatedParams?.expand?.split(",")
  )

  const discount = await discountService.retrieve(discount_id, config)

  res.status(200).json({ discount })
}

export class AdminPostDiscountsConditions extends AdminUpsertConditionsReq {
  @IsString()
  operator: DiscountConditionOperator
}

export class AdminPostDiscountsConditionsParams {
  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
