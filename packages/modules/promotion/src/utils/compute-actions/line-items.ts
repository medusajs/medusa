import {
  ApplicationMethodAllocationValues,
  BigNumberInput,
  InferEntityType,
  PromotionTypes,
} from "@medusajs/framework/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  calculateAdjustmentAmountFromPromotion,
  ComputedActions,
  MathBN,
  MedusaError,
  ApplicationMethodTargetType as TargetType,
} from "@medusajs/framework/utils"
import { Promotion } from "@models"
import { areRulesValidForContext } from "../validations"
import { sortLineItemByPriceAscending } from "./sort-by-price"
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
  promotion: PromotionTypes.PromotionDTO | InferEntityType<typeof Promotion>,
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

function applyPromotionToItems(
  promotion: PromotionTypes.PromotionDTO | InferEntityType<typeof Promotion>,
  items: PromotionTypes.ComputeActionContext[TargetType.ITEMS],
  appliedPromotionsMap: Map<string, BigNumberInput>,
  allocationOverride?: ApplicationMethodAllocationValues
): PromotionTypes.ComputeActions[] {
  const { application_method: applicationMethod } = promotion

  if (!applicationMethod) {
    return []
  }

  const allocation = applicationMethod?.allocation! || allocationOverride
  const target = applicationMethod?.target_type

  if (!items?.length || !target) {
    return []
  }

  const computedActions: PromotionTypes.ComputeActions[] = []

  let applicableItems = getValidItemsForPromotion(
    items,
    promotion
  ) as PromotionTypes.ComputeActionItemLine[]

  if (!applicableItems.length) {
    return computedActions
  }

  if (allocation === ApplicationMethodAllocation.ONCE) {
    applicableItems = applicableItems.sort(sortLineItemByPriceAscending)
  }

  const isTargetLineItems = target === TargetType.ITEMS
  const isTargetOrder = target === TargetType.ORDER
  const promotionValue = applicationMethod?.value ?? 0
  const maxQuantity = applicationMethod?.max_quantity!
  let remainingQuota = maxQuantity ?? 0

  let lineItemsAmount = MathBN.convert(0)
  if (allocation === ApplicationMethodAllocation.ACROSS) {
    lineItemsAmount = applicableItems.reduce((acc, item) => {
      const itemBase = promotion.is_tax_inclusive
        ? item.original_total
        : item.subtotal
      const appliedExclTax = appliedPromotionsMap.get(item.id) ?? 0
      const appliedInBase = promotion.is_tax_inclusive
        ? MathBN.mult(
            appliedExclTax,
            MathBN.div(item.original_total, item.subtotal)
          )
        : appliedExclTax

      return MathBN.sub(MathBN.add(acc, itemBase), appliedInBase)
    }, MathBN.convert(0))

    if (MathBN.lte(lineItemsAmount, 0)) {
      return computedActions
    }
  }

  for (const item of applicableItems) {
    if (
      allocation === ApplicationMethodAllocation.ONCE &&
      remainingQuota <= 0
    ) {
      break
    }
    if (
      MathBN.lte(
        promotion.is_tax_inclusive ? item.original_total : item.subtotal,
        0
      )
    ) {
      continue
    }

    const appliedPromoValue = appliedPromotionsMap.get(item.id) ?? 0

    const effectiveMaxQuantity =
      allocation === ApplicationMethodAllocation.ONCE
        ? Math.min(remainingQuota ?? 0, Number(item.quantity))
        : maxQuantity

    // If the allocation is once, we rely on the existing logic for each allocation, as the calculate is the same: apply the promotion value to the line item
    const effectiveAllocation =
      allocation === ApplicationMethodAllocation.ONCE
        ? ApplicationMethodAllocation.EACH
        : allocation

    const amount = calculateAdjustmentAmountFromPromotion(
      item,
      {
        value: promotionValue,
        applied_value: appliedPromoValue,
        is_tax_inclusive: promotion.is_tax_inclusive,
        max_quantity: effectiveMaxQuantity,
        type: applicationMethod?.type!,
        allocation: effectiveAllocation,
      },
      lineItemsAmount
    )

    if (MathBN.lte(amount, 0)) {
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

    const appliedAmountExclTax = promotion.is_tax_inclusive
      ? MathBN.mult(amount, MathBN.div(item.subtotal, item.original_total))
      : amount

    appliedPromotionsMap.set(
      item.id,
      MathBN.add(appliedPromoValue, appliedAmountExclTax)
    )

    if (allocation === ApplicationMethodAllocation.ONCE) {
      // We already know exactly how many units we applied via effectiveMaxQuantity
      const quantityApplied = Math.min(
        effectiveMaxQuantity,
        Number(item.quantity)
      )
      remainingQuota -= quantityApplied
    }

    if (isTargetLineItems || isTargetOrder) {
      computedActions.push({
        action: ComputedActions.ADD_ITEM_ADJUSTMENT,
        item_id: item.id,
        amount,
        code: promotion.code!,
        is_tax_inclusive: promotion.is_tax_inclusive,
      })
    }
  }

  return computedActions
}

function getValidItemsForPromotion(
  items:
    | PromotionTypes.ComputeActionContext[TargetType.ITEMS]
    | PromotionTypes.ComputeActionContext[TargetType.SHIPPING_METHODS],
  promotion: PromotionTypes.PromotionDTO | InferEntityType<typeof Promotion>
) {
  if (!items?.length || !promotion?.application_method) {
    return []
  }

  const isTargetShippingMethod =
    promotion.application_method?.target_type === TargetType.SHIPPING_METHODS

  const targetRules = promotion.application_method?.target_rules ?? []
  const hasTargetRules = targetRules.length > 0

  if (isTargetShippingMethod && !hasTargetRules) {
    return items.filter(
      (item) => item && "subtotal" in item && MathBN.gt(item.subtotal, 0)
    )
  }

  return items.filter((item) => {
    if (!item) {
      return false
    }

    if ("is_discountable" in item && !item.is_discountable) {
      return false
    }

    if (!("subtotal" in item) || MathBN.lte(item.subtotal, 0)) {
      return false
    }

    if (!isTargetShippingMethod && !("quantity" in item)) {
      return false
    }

    if (!hasTargetRules) {
      return true
    }

    return areRulesValidForContext(
      promotion?.application_method?.target_rules!,
      item,
      ApplicationMethodTargetType.ITEMS
    )
  })
}
