import { IsOptional, IsString } from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import { Discount } from "../../../../models/discount"
import { DiscountService } from "../../../../services"
import DiscountConditionService from "../../../../services/discount-condition"
import { AdminUpsertConditionsReq } from "../../../../types/discount"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"
/**
 * @oas [post] /discounts/{id}/conditions/{condition_id}
 * operationId: "PostDiscountsConditionsCondition"
 * summary: "Updates a DiscountCondition"
 * x-authenticated: true
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
    AdminPostDiscountsConditionsCondition,
    req.body
  )

  const validatedParams = await validator(
    AdminPostDiscountsConditionsConditionParams,
    req.query
  )

  const conditionService: DiscountConditionService = req.scope.resolve(
    "discountConditionService"
  )
  const discountService: DiscountService = req.scope.resolve("discountService")

  const updateObj = { ...validatedCondition, id: condition_id }

  let discount = await discountService.retrieve(discount_id)

  await conditionService.upsertCondition(discount, updateObj)

  const config = getRetrieveConfig<Discount>(
    defaultAdminDiscountsFields,
    defaultAdminDiscountsRelations,
    validatedParams?.fields?.split(",") as (keyof Discount)[],
    validatedParams?.expand?.split(",")
  )

  discount = await discountService.retrieve(discount.id, config)

  res.status(200).json({ discount })
}

export class AdminPostDiscountsConditionsCondition extends AdminUpsertConditionsReq {}

export class AdminPostDiscountsConditionsConditionParams {
  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
