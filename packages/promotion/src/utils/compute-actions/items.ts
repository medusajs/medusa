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

  return applyPromotionToItems(promotion, applicableItems, allocationOverride)
}

export function applyPromotionToItems(
  promotion: PromotionTypes.PromotionDTO,
  items: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.ITEMS],
  allocationOverride?: ApplicationMethodAllocationValues
): PromotionTypes.ComputeActions[] {
  const { application_method: applicationMethod } = promotion
  const allocation = applicationMethod?.allocation!
  const computedActions: PromotionTypes.ComputeActions[] = []

  if (
    [allocation, allocationOverride].includes(ApplicationMethodAllocation.EACH)
  ) {
    for (const item of items!) {
      const promotionValue = parseFloat(applicationMethod!.value!)
      let amount = promotionValue

      const applicableTotal =
        item.unit_price *
        Math.min(item.quantity, applicationMethod?.max_quantity!)

      if (promotionValue > applicableTotal) {
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

  if (
    [allocation, allocationOverride].includes(
      ApplicationMethodAllocation.ACROSS
    )
  ) {
    const totalApplicableValue = items!.reduce(
      (acc, item) =>
        acc +
        item.unit_price *
          Math.min(item.quantity, applicationMethod?.max_quantity!),
      0
    )

    for (const item of items!) {
      const promotionValue = parseFloat(applicationMethod!.value!)
      const applicableTotal =
        item.unit_price *
        Math.min(item.quantity, applicationMethod?.max_quantity!)

      // TODO: should we worry about precision here?
      const applicablePromotionValue = Math.round(
        (applicableTotal / totalApplicableValue) * promotionValue
      )

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
