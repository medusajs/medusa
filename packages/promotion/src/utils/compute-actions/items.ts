import {
  ApplicationMethodAllocationValues,
  PromotionTypes,
} from "@medusajs/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  ApplicationMethodType,
  ComputedActions,
  MedusaError,
} from "@medusajs/utils"
import { areRulesValidForContext } from "../validations"
import { computeActionForBudgetExceeded } from "./usage"

export function getComputedActionsForItems(
  promotion: PromotionTypes.PromotionDTO,
  itemApplicationContext: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.ITEMS],
  methodIdPromoValueMap: Map<string, number>,
  allocationOverride?: ApplicationMethodAllocationValues
): PromotionTypes.ComputeActions[] {
  const applicableItems: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.ITEMS] =
    []

  if (!itemApplicationContext) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `"items" should be present as an array in the context for computeActions`
    )
  }

  for (const itemContext of itemApplicationContext) {
    const isPromotionApplicableToItem = areRulesValidForContext(
      promotion?.application_method?.target_rules!,
      itemContext
    )

    if (!isPromotionApplicableToItem) {
      continue
    }

    applicableItems.push(itemContext)
  }

  return applyPromotionToItems(
    promotion,
    applicableItems,
    methodIdPromoValueMap,
    allocationOverride
  )
}

// TODO: calculations should eventually move to a totals util outside of the module
export function applyPromotionToItems(
  promotion: PromotionTypes.PromotionDTO,
  items: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.ITEMS],
  methodIdPromoValueMap: Map<string, number>,
  allocationOverride?: ApplicationMethodAllocationValues
): PromotionTypes.ComputeActions[] {
  const { application_method: applicationMethod } = promotion
  const allocation = applicationMethod?.allocation!
  const computedActions: PromotionTypes.ComputeActions[] = []

  if (
    [allocation, allocationOverride].includes(ApplicationMethodAllocation.EACH)
  ) {
    for (const method of items!) {
      if (!method.subtotal || !method.quantity) {
        continue
      }

      const appliedPromoValue = methodIdPromoValueMap.get(method.id) ?? 0
      const quantityMultiplier = Math.min(
        method.quantity,
        applicationMethod?.max_quantity!
      )
      const totalItemValue =
        (method.subtotal / method.quantity) * quantityMultiplier
      let promotionValue = applicationMethod?.value ?? 0
      const applicableTotal = totalItemValue - appliedPromoValue
      if (applicationMethod?.type === ApplicationMethodType.PERCENTAGE) {
        promotionValue = (promotionValue / 100) * applicableTotal
      }

      const amount = Math.min(promotionValue, applicableTotal)

      if (amount <= 0) {
        continue
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
  }

  if (
    [allocation, allocationOverride].includes(
      ApplicationMethodAllocation.ACROSS
    )
  ) {
    const totalApplicableValue = items!.reduce((acc, method) => {
      const appliedPromoValue = methodIdPromoValueMap.get(method.id) ?? 0
      const perItemCost = method.subtotal
        ? method.subtotal / method.quantity
        : 0

      return acc + perItemCost * method.quantity - appliedPromoValue
    }, 0)

    for (const method of items!) {
      if (!method.subtotal || !method.quantity) {
        continue
      }

      const appliedPromoValue = methodIdPromoValueMap.get(method.id) ?? 0
      const promotionValue = applicationMethod?.value ?? 0
      const applicableTotal =
        (method.subtotal / method.quantity) * method.quantity -
        appliedPromoValue

      if (applicableTotal <= 0) {
        continue
      }

      // TODO: should we worry about precision here?
      let applicablePromotionValue =
        (applicableTotal / totalApplicableValue) * promotionValue

      if (applicationMethod?.type === ApplicationMethodType.PERCENTAGE) {
        applicablePromotionValue = (promotionValue / 100) * applicableTotal
      }

      const amount = Math.min(applicablePromotionValue, applicableTotal)

      if (amount <= 0) {
        continue
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
  }

  return computedActions
}
