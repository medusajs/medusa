import {
  ApplicationMethodAllocationValues,
  PromotionTypes,
} from "@medusajs/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  MedusaError,
} from "@medusajs/utils"
import { areRulesValidForContext } from "../validations"

export function getComputedActionsForItems(
  promotion: PromotionTypes.PromotionDTO,
  itemApplicationContext: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.ITEMS],
  itemIdPromoValueMap: Map<string, number>,
  allocationOverride?: ApplicationMethodAllocationValues
): PromotionTypes.ComputeActions[] {
  const applicableItems: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.ITEMS] =
    []

  if (!itemApplicationContext) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `"items" not found in context`
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
    itemIdPromoValueMap,
    allocationOverride
  )
}

export function applyPromotionToItems(
  promotion: PromotionTypes.PromotionDTO,
  items: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.ITEMS],
  itemIdPromoValueMap: Map<string, number>,
  allocationOverride?: ApplicationMethodAllocationValues
): PromotionTypes.ComputeActions[] {
  const { application_method: applicationMethod } = promotion
  const allocation = applicationMethod?.allocation!
  const computedActions: PromotionTypes.ComputeActions[] = []

  if (
    [allocation, allocationOverride].includes(ApplicationMethodAllocation.EACH)
  ) {
    for (const item of items!) {
      const appliedPromoValue = itemIdPromoValueMap.get(item.id) || 0
      const promotionValue = parseFloat(applicationMethod!.value!)
      const applicableTotal =
        item.unit_price *
          Math.min(item.quantity, applicationMethod?.max_quantity!) -
        appliedPromoValue

      let amount = promotionValue

      if (promotionValue > applicableTotal) {
        amount = applicableTotal
      }

      if (amount <= 0) {
        continue
      }

      itemIdPromoValueMap.set(item.id, appliedPromoValue + amount)

      computedActions.push({
        action: "addItemAdjustment",
        item_id: item.id,
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
    const totalApplicableValue = items!.reduce((acc, item) => {
      const appliedPromoValue = itemIdPromoValueMap.get(item.id) || 0
      return (
        acc +
        item.unit_price *
          Math.min(item.quantity, applicationMethod?.max_quantity!) -
        appliedPromoValue
      )
    }, 0)

    for (const item of items!) {
      const promotionValue = parseFloat(applicationMethod!.value!)
      const appliedPromoValue = itemIdPromoValueMap.get(item.id) || 0

      const applicableTotal =
        item.unit_price *
          Math.min(item.quantity, applicationMethod?.max_quantity!) -
        appliedPromoValue

      // TODO: should we worry about precision here?
      const applicablePromotionValue =
        (applicableTotal / totalApplicableValue) * promotionValue

      let amount = applicablePromotionValue

      if (applicablePromotionValue > applicableTotal) {
        amount = applicableTotal
      }

      if (amount <= 0) {
        continue
      }

      computedActions.push({
        action: "addItemAdjustment",
        item_id: item.id,
        amount,
        code: promotion.code!,
      })
    }
  }

  return computedActions
}
