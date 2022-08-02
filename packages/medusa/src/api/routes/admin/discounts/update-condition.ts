import { IsOptional, IsString } from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import { Discount } from "../../../../models"
import { DiscountService } from "../../../../services"
import DiscountConditionService from "../../../../services/discount-condition"
import { AdminUpsertConditionsReq } from "../../../../types/discount"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"
/**
 * @oas [post] /discounts/{discount_id}/conditions/{condition_id}
 * operationId: "PostDiscountsDiscountConditionsCondition"
 * summary: "Updates a DiscountCondition"
 * x-authenticated: true
 * parameters:
 *   - (path) discount_id=* {string} The id of the Product.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each product of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each product of the result.
 * description: "Updates a DiscountCondition"
 * requestBody:
 *   content:
 *     application/json:
 *       required:
 *         - id
 *       schema:
 *         properties:
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
  const { discount_id, condition_id } = req.params

  const validatedCondition = await validator(
    AdminPostDiscountsDiscountConditionsCondition,
    req.body
  )

  const validatedParams = await validator(
    AdminPostDiscountsDiscountConditionsConditionParams,
    req.query
  )

  const conditionService: DiscountConditionService = req.scope.resolve(
    "discountConditionService"
  )

  const condition = await conditionService.retrieve(condition_id)

  const discountService: DiscountService = req.scope.resolve("discountService")

  let discount = await discountService.retrieve(discount_id)

  const updateObj = {
    ...validatedCondition,
    rule_id: discount.rule_id,
    id: condition.id,
  }

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await conditionService
      .withTransaction(transactionManager)
      .upsertCondition(updateObj)
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

export class AdminPostDiscountsDiscountConditionsCondition extends AdminUpsertConditionsReq {}

export class AdminPostDiscountsDiscountConditionsConditionParams {
  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
