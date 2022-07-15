import { IsOptional, IsString } from "class-validator"
import { MedusaError } from "medusa-core-utils"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import { Discount } from "../../../../models"
import { DiscountService } from "../../../../services"
import DiscountConditionService from "../../../../services/discount-condition"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [delete] /discounts/{discount_id}/conditions/{condition_id}
 * operationId: "DeleteDiscountsDiscountConditionsCondition"
 * summary: "Delete a DiscountCondition"
 * description: "Deletes a DiscountCondition"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Discount
 *   - (path) condition_id=* {string} The id of the DiscountCondition
 * tags:
 *   - Discount
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The id of the deleted DiscountCondition
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 *             discount:
 *               type: object
 *               description: The Discount to which the condition used to belong
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
