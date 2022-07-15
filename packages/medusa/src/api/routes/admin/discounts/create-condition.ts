import { IsOptional, IsString } from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import { Discount, DiscountConditionOperator } from "../../../../models"
import { DiscountService } from "../../../../services"
import DiscountConditionService from "../../../../services/discount-condition"
import { AdminUpsertConditionsReq } from "../../../../types/discount"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"
/**
 * @oas [post] /discounts/{discount_id}/conditions
 * operationId: "PostDiscountsDiscountConditions"
 * summary: "Creates a DiscountCondition"
 * x-authenticated: true
 * parameters:
 *   - (path) discount_id=* {string} The id of the Product.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each product of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each product of the result.
 * description: "Creates a DiscountCondition"
 * requestBody:
 *   content:
 *     application/json:
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

  const validatedCondition = await validator(
    AdminPostDiscountsDiscountConditions,
    req.body
  )

  const validatedParams = await validator(
    AdminPostDiscountsDiscountConditionsParams,
    req.query
  )

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
        ...validatedCondition,
        rule_id: discount.rule_id,
      })
  })

  const config = getRetrieveConfig<Discount>(
    defaultAdminDiscountsFields,
    defaultAdminDiscountsRelations,
    validatedParams?.fields?.split(",") as (keyof Discount)[],
    validatedParams?.expand?.split(",")
  )

  discount = await discountService.retrieve(discount.id, config)

  res.status(200).json({ discount })
}

export class AdminPostDiscountsDiscountConditions extends AdminUpsertConditionsReq {
  @IsString()
  operator: DiscountConditionOperator
}

export class AdminPostDiscountsDiscountConditionsParams {
  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
