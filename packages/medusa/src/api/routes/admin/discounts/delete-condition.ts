import { IsOptional, IsString } from "class-validator"
import { MedusaError } from "medusa-core-utils"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import { Discount } from "../../../../models"
import { DiscountService } from "../../../../services"
import DiscountConditionService from "../../../../services/discount-condition"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"

/**
 * @oas [delete] /discounts/{id}/conditions/{condition_id}
 * operationId: "DeleteDiscountsDiscountCondition"
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
    AdminDeleteDiscountsConditionsConditionParams,
    req.query
  )

  const conditionService: DiscountConditionService = req.scope.resolve(
    "discountConditionService"
  )
  const discountService: DiscountService = req.scope.resolve("discountService")

  const condition = await conditionService
    .retrieve(condition_id, discount_id)
    .catch(() => void 0)

  if (!condition) {
    // resolves idempotently in case of non-existing condition
    return res.json({
      id: condition_id,
      object: "discount-condition",
      deleted: true,
    })
  }

  if (!condition?.discount) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Discount with id ${discount_id} does not belong to condition with id ${condition.id}`
    )
  }

  await conditionService.remove(condition_id)

  const config = getRetrieveConfig<Discount>(
    defaultAdminDiscountsFields,
    defaultAdminDiscountsRelations,
    validatedParams?.fields?.split(",") as (keyof Discount)[],
    validatedParams?.expand?.split(",")
  )

  const discount = await discountService.retrieve(discount_id, config)

  res.json({
    id: condition_id,
    object: "discount-condition",
    deleted: true,
    discount,
  })
}

export class AdminDeleteDiscountsConditionsConditionParams {
  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
