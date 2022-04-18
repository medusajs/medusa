import { IsOptional, IsString } from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import { Discount } from "../../../../models"
import { DiscountService } from "../../../../services"
import DiscountConditionService from "../../../../services/discount-condition"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"

/**
 * @oas [delete] /discounts/{id}/conditions/{conditionId}
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
 *               description: The id of the deleted Discount
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
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
