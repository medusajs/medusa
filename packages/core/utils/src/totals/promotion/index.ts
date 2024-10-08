import { BigNumberInput } from "@medusajs/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodType,
} from "../../promotion"
import { MathBN } from "../math"

function getPromotionValueForPercentage(promotion, lineItemTotal) {
  return MathBN.mult(MathBN.div(promotion.value, 100), lineItemTotal)
}

function getPromotionValueForFixed(promotion, lineItemTotal, lineItemsTotal) {
  if (promotion.allocation === ApplicationMethodAllocation.ACROSS) {
    return MathBN.mult(
      MathBN.div(lineItemTotal, lineItemsTotal),
      promotion.value
    )
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
    return MathBN.min(lineItem.quantity, maxQuantity)
  }

  return lineItem.quantity
}

function getLineItemUnitPrice(lineItem) {
  return MathBN.div(lineItem.subtotal, lineItem.quantity)
}

export function calculateAdjustmentAmountFromPromotion(
  lineItem,
  promotion,
  lineItemsTotal: BigNumberInput = 0
) {
  const quantity = getApplicableQuantity(lineItem, promotion.max_quantity)
  const lineItemTotal = MathBN.mult(getLineItemUnitPrice(lineItem), quantity)
  const applicableTotal = MathBN.sub(lineItemTotal, promotion.applied_value)

  if (MathBN.lte(applicableTotal, 0)) {
    return applicableTotal
  }

  const promotionValue = getPromotionValue(
    promotion,
    applicableTotal,
    lineItemsTotal
  )

  return MathBN.min(promotionValue, applicableTotal)
}
