import {
  ApplicationMethodAllocation,
  ApplicationMethodType,
} from "../../promotion"

function getPromotionValueForPercentage(promotion, lineItemTotal) {
  return (promotion.value / 100) * lineItemTotal
}

function getPromotionValueForFixed(promotion, lineItemTotal, lineItemsTotal) {
  if (promotion.allocation === ApplicationMethodAllocation.ACROSS) {
    return (lineItemTotal / lineItemsTotal) * promotion.value
  }

  return promotion.value
}

export function getPromotionValue(promotion, lineItemTotal, lineItemsTotal) {
  if (promotion.type === ApplicationMethodType.PERCENTAGE) {
    return getPromotionValueForPercentage(promotion, lineItemTotal)
  }

  return getPromotionValueForFixed(promotion, lineItemTotal, lineItemsTotal)
}

export function getApplicableQuantity(lineItem, maxQuantity) {
  if (maxQuantity && lineItem.quantity) {
    return Math.min(lineItem.quantity, maxQuantity)
  }

  return lineItem.quantity
}

function getLineItemUnitPrice(lineItem) {
  return lineItem.subtotal / lineItem.quantity
}

export function calculateAdjustmentAmountFromPromotion(
  lineItem,
  promotion,
  lineItemsTotal = 0
) {
  const quantity = getApplicableQuantity(lineItem, promotion.max_quantity)
  const lineItemTotal = getLineItemUnitPrice(lineItem) * quantity
  const applicableTotal = lineItemTotal - promotion.applied_value

  if (applicableTotal <= 0) {
    return applicableTotal
  }

  const promotionValue = getPromotionValue(
    promotion,
    applicableTotal,
    lineItemsTotal
  )

  return Math.min(promotionValue, applicableTotal)
}
