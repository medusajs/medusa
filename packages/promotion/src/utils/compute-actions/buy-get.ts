import { PromotionTypes } from "@medusajs/types"
import {
  ApplicationMethodTargetType,
  ComputedActions,
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
  methodIdPromoValueMap: Map<string, number>
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

  const validQuantity = itemsContext
    .filter((item) => areRulesValidForContext(buyRules, item))
    .reduce((acc, next) => acc + next.quantity, 0)

  if (
    !buyRulesMinQuantity ||
    !applyToQuantity ||
    buyRulesMinQuantity > validQuantity
  ) {
    return []
  }

  const validItemsForTargetRules = itemsContext
    .filter((item) => areRulesValidForContext(targetRules, item))
    .filter((item) => isPresent(item.subtotal) && isPresent(item.quantity))
    .sort((a, b) => {
      const aPrice = a.subtotal / a.quantity
      const bPrice = b.subtotal / b.quantity

      return bPrice - aPrice
    })

  let remainingQtyToApply = applyToQuantity

  for (const method of validItemsForTargetRules) {
    const appliedPromoValue = methodIdPromoValueMap.get(method.id) ?? 0
    const multiplier = Math.min(method.quantity, remainingQtyToApply)
    const amount = (method.subtotal / method.quantity) * multiplier
    const newRemainingQtyToApply = remainingQtyToApply - multiplier

    if (newRemainingQtyToApply < 0 || amount <= 0) {
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

    methodIdPromoValueMap.set(method.id, appliedPromoValue + amount)

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
