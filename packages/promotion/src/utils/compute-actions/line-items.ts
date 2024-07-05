import {
  ApplicationMethodAllocationValues,
  PromotionTypes,
} from "@medusajs/types"
import {
  ApplicationMethodAllocation,
  ComputedActions,
  MedusaError,
  ApplicationMethodTargetType as TargetType,
  calculateAdjustmentAmountFromPromotion,
} from "@medusajs/utils"
import { areRulesValidForContext } from "../validations"
import { computeActionForBudgetExceeded } from "./usage"

function validateContext(
  contextKey: string,
  context: PromotionTypes.ComputeActionContext[TargetType]
) {
  if (!context) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `"${contextKey}" should be present as an array in the context for computeActions`
    )
  }
}

export function getComputedActionsForItems(
  promotion: PromotionTypes.PromotionDTO,
  items: PromotionTypes.ComputeActionContext[TargetType.ITEMS],
  appliedPromotionsMap: Map<string, number>,
  allocationOverride?: ApplicationMethodAllocationValues
): PromotionTypes.ComputeActions[] {
  validateContext("items", items)

  return applyPromotionToItems(
    promotion,
    items,
    appliedPromotionsMap,
    allocationOverride
  )
}

export function getComputedActionsForShippingMethods(
  promotion: PromotionTypes.PromotionDTO,
  shippingMethods: PromotionTypes.ComputeActionContext[TargetType.SHIPPING_METHODS],
  appliedPromotionsMap: Map<string, number>
): PromotionTypes.ComputeActions[] {
  validateContext("shipping_methods", shippingMethods)

  return applyPromotionToItems(promotion, shippingMethods, appliedPromotionsMap)
}

export function getComputedActionsForOrder(
  promotion: PromotionTypes.PromotionDTO,
  itemApplicationContext: PromotionTypes.ComputeActionContext,
  methodIdPromoValueMap: Map<string, number>
): PromotionTypes.ComputeActions[] {
  return getComputedActionsForItems(
    promotion,
    itemApplicationContext[TargetType.ITEMS],
    methodIdPromoValueMap,
    ApplicationMethodAllocation.ACROSS
  )
}

function applyPromotionToItems(
  promotion: PromotionTypes.PromotionDTO,
  items:
    | PromotionTypes.ComputeActionContext[TargetType.ITEMS]
    | PromotionTypes.ComputeActionContext[TargetType.SHIPPING_METHODS],
  appliedPromotionsMap: Map<string, number>,
  allocationOverride?: ApplicationMethodAllocationValues
): PromotionTypes.ComputeActions[] {
  const { application_method: applicationMethod } = promotion
  const allocation = applicationMethod?.allocation! || allocationOverride
  const computedActions: PromotionTypes.ComputeActions[] = []
  const applicableItems = getValidItemsForPromotion(items, promotion)
  const target = applicationMethod?.target_type

  const isTargetShippingMethod = target === TargetType.SHIPPING_METHODS
  const isTargetLineItems = target === TargetType.ITEMS
  const isTargetOrder = target === TargetType.ORDER

  let lineItemsTotal = 0

  if (allocation === ApplicationMethodAllocation.ACROSS) {
    lineItemsTotal = applicableItems.reduce(
      (acc, item) =>
        acc + item.subtotal - (appliedPromotionsMap.get(item.id) ?? 0),
      0
    )
  }

  for (const item of applicableItems!) {
    const appliedPromoValue = appliedPromotionsMap.get(item.id) ?? 0
    const maxQuantity = isTargetShippingMethod
      ? 1
      : applicationMethod?.max_quantity!

    if (isTargetShippingMethod) {
      item.quantity = 1
    }

    const amount = calculateAdjustmentAmountFromPromotion(
      item,
      {
        value: applicationMethod?.value ?? 0,
        applied_value: appliedPromoValue,
        max_quantity: maxQuantity,
        type: applicationMethod?.type!,
        allocation,
      },
      lineItemsTotal
    )

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

    appliedPromotionsMap.set(item.id, appliedPromoValue + amount)

    if (isTargetLineItems || isTargetOrder) {
      computedActions.push({
        action: ComputedActions.ADD_ITEM_ADJUSTMENT,
        item_id: item.id,
        amount,
        code: promotion.code!,
      })
    }

    if (isTargetShippingMethod) {
      computedActions.push({
        action: ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT,
        shipping_method_id: item.id,
        amount,
        code: promotion.code!,
      })
    }
  }

  return computedActions
}

function getValidItemsForPromotion(
  items:
    | PromotionTypes.ComputeActionContext[TargetType.ITEMS]
    | PromotionTypes.ComputeActionContext[TargetType.SHIPPING_METHODS],
  promotion: PromotionTypes.PromotionDTO
) {
  const isTargetShippingMethod =
    promotion.application_method?.target_type === TargetType.SHIPPING_METHODS

  return (
    items?.filter((item) => {
      const isSubtotalPresent = "subtotal" in item
      const isQuantityPresent = "quantity" in item
      const isPromotionApplicableToItem = areRulesValidForContext(
        promotion?.application_method?.target_rules!,
        item
      )

      return (
        isPromotionApplicableToItem &&
        (isQuantityPresent || isTargetShippingMethod) &&
        isSubtotalPresent
      )
    }) || []
  )
}
