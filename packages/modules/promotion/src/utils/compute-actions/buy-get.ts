import { BigNumberInput, PromotionTypes } from "@medusajs/types"
import {
  ApplicationMethodTargetType,
  ComputedActions,
  MathBN,
  MedusaError,
  PromotionType,
  isPresent,
} from "@medusajs/utils"
import { areRulesValidForContext } from "../validations"
import { computeActionForBudgetExceeded } from "./usage"

// TODO: calculations should eventually move to a totals util outside of the module
export function getComputedActionsForBuyGet(
  promotion: PromotionTypes.PromotionDTO,
  itemsContext: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.ITEMS],
  methodIdPromoValueMap: Map<string, BigNumberInput>
): PromotionTypes.ComputeActions[] {
  const buyRulesMinQuantity =
    promotion.application_method?.buy_rules_min_quantity
  const applyToQuantity = promotion.application_method?.apply_to_quantity
  const buyRules = promotion.application_method?.buy_rules
  const targetRules = promotion.application_method?.target_rules
  const computedActions: PromotionTypes.ComputeActions[] = []

  if (!itemsContext) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `"items" should be present as an array in the context to compute actions`
    )
  }

  if (!Array.isArray(buyRules) || !Array.isArray(targetRules)) {
    return []
  }

  const validQuantity = MathBN.sum(
    ...itemsContext
      .filter((item) => areRulesValidForContext(buyRules, item))
      .map((item) => item.quantity)
  )

  if (
    !buyRulesMinQuantity ||
    !applyToQuantity ||
    MathBN.gt(buyRulesMinQuantity, validQuantity)
  ) {
    return []
  }

  const validItemsForTargetRules = itemsContext
    .filter((item) => areRulesValidForContext(targetRules, item))
    .filter((item) => isPresent(item.subtotal) && isPresent(item.quantity))
    .sort((a, b) => {
      const aPrice = MathBN.div(a.subtotal, a.quantity)
      const bPrice = MathBN.div(b.subtotal, b.quantity)

      return MathBN.lt(bPrice, aPrice) ? -1 : 1
    })

  let remainingQtyToApply = MathBN.convert(applyToQuantity)

  for (const method of validItemsForTargetRules) {
    const appliedPromoValue = methodIdPromoValueMap.get(method.id) ?? 0
    const multiplier = MathBN.min(method.quantity, remainingQtyToApply)
    const amount = MathBN.mult(
      MathBN.div(method.subtotal, method.quantity),
      multiplier
    )
    const newRemainingQtyToApply = MathBN.sub(remainingQtyToApply, multiplier)

    if (MathBN.lt(newRemainingQtyToApply, 0) || MathBN.lte(amount, 0)) {
      break
    } else {
      remainingQtyToApply = newRemainingQtyToApply
    }

    const budgetExceededAction = computeActionForBudgetExceeded(
      promotion,
      amount
    )

    if (budgetExceededAction) {
      computedActions.push(budgetExceededAction)

      continue
    }

    methodIdPromoValueMap.set(method.id, MathBN.add(appliedPromoValue, amount))

    computedActions.push({
      action: ComputedActions.ADD_ITEM_ADJUSTMENT,
      item_id: method.id,
      amount,
      code: promotion.code!,
    })
  }

  return computedActions
}

export function sortByBuyGetType(a, b) {
  if (a.type === PromotionType.BUYGET && b.type !== PromotionType.BUYGET) {
    return -1
  } else if (
    a.type !== PromotionType.BUYGET &&
    b.type === PromotionType.BUYGET
  ) {
    return 1
  } else {
    return 0
  }
}
