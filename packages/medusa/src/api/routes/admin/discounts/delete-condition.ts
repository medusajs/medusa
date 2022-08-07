import { IsOptional, IsString } from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."

import { Discount } from "../../../../models"
import DiscountConditionService from "../../../../services/discount-condition"
import { DiscountService } from "../../../../services"
import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"

/**
 * @oas [delete] /discounts/{discount_id}/conditions/{condition_id}
 * operationId: "DeleteDiscountsDiscountConditionsCondition"
 * summary: "Delete a DiscountCondition"
 * description: "Deletes a DiscountCondition"
 * x-authenticated: true
 * parameters:
 *   - (path) discount_id=* {string} The ID of the Discount
 *   - (path) condition_id=* {string} The ID of the DiscountCondition
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
 * tags:
 *   - Discount Condition
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted DiscountCondition
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: discount-condition
 *             deleted:
 *               type: boolean
 *               description: Whether the discount condition was deleted successfully or not.
 *               default: true
 *             discount:
 *               description: The Discount to which the condition used to belong
 *               $ref: "#/components/schemas/discount"
 */
export default async (req, res) => {
  const { discount_id, condition_id } = req.params

  const validatedParams = await validator(
    AdminDeleteDiscountsDiscountConditionsConditionParams,
    req.query
  )

  const conditionService: DiscountConditionService = req.scope.resolve(
    "discountConditionService"
  )

  const condition = await conditionService
    .retrieve(condition_id)
    .catch(() => void 0)

  if (!condition) {
    // resolves idempotently in case of non-existing condition
    return res.json({
      id: condition_id,
      object: "discount-condition",
      deleted: true,
    })
  }

  const discountService: DiscountService = req.scope.resolve("discountService")

  let discount = await discountService.retrieve(discount_id, {
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

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await conditionService
      .withTransaction(transactionManager)
      .delete(condition_id)
  })

  const config = getRetrieveConfig<Discount>(
    defaultAdminDiscountsFields,
    defaultAdminDiscountsRelations,
    validatedParams?.fields?.split(",") as (keyof Discount)[],
    validatedParams?.expand?.split(",")
  )

  discount = await discountService.retrieve(discount_id, config)

  res.json({
    id: condition_id,
    object: "discount-condition",
    deleted: true,
    discount,
  })
}

export class AdminDeleteDiscountsDiscountConditionsConditionParams {
  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
