import { MedusaError } from "medusa-core-utils"
import { DiscountConditionService, DiscountService } from "../../../services"

export async function doesConditionBelongToDiscount(req, res, next) {
  try {
    const { discount_id, condition_id } = req.params
    const conditionService: DiscountConditionService = req.scope.resolve(
      "discountConditionService"
    )
    const discountService: DiscountService =
      req.scope.resolve("discountService")

    const discount = await discountService.retrieve(discount_id, {
      select: ["id", "rule_id"],
    })
    const condition = await conditionService.retrieve(condition_id, {
      select: ["id", "discount_rule_id"],
    })

    if (condition.discount_rule_id !== discount.rule_id) {
      return next(
        new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Condition with id ${condition_id} does not belong to Discount with id ${discount_id}`
        )
      )
    }

    next()
  } catch (e) {
    next(e)
  }
}
