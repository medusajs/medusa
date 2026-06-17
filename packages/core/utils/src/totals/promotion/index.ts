import { BigNumberInput } from "@medusajs/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodType,
} from "../../promotion"
import { MathBN } from "../math"
import { MEDUSA_EPSILON } from "../big-number"

function getPromotionValueForPercentage(promotion, lineItemAmount) {
  return MathBN.mult(MathBN.div(promotion.value, 100), lineItemAmount)
}

function getPromotionValueForFixed(
  promotion,
  lineItemAmount,
  lineItemsAmount,
  lineItem
) {
  if (promotion.allocation === ApplicationMethodAllocation.ACROSS) {
    const promotionValueForItem = MathBN.mult(
      MathBN.div(lineItemAmount, lineItemsAmount),
      promotion.value
    )

    if (MathBN.lte(promotionValueForItem, lineItemAmount)) {
      return promotionValueForItem
    }

    const percentage = MathBN.div(
      MathBN.mult(lineItemAmount, 100),
      promotionValueForItem
    )

    return MathBN.mult(promotionValueForItem, MathBN.div(percentage, 100))
  }

  // For each allocation, promotion is applied in the scope of the line item.
  // lineItemAmount will be the total applicable amount for the line item
  // maximumPromotionAmount is the maximum amount that can be applied to the line item
  // We need to return the minimum of the two
  const maximumQuantity = MathBN.min(
    lineItem.quantity,
    promotion.max_quantity ?? MathBN.convert(1)
  )

  const maximumPromotionAmount = MathBN.mult(promotion.value, maximumQuantity)

  return MathBN.min(maximumPromotionAmount, lineItemAmount)
}

export function getPromotionValue(
  promotion,
  lineItemAmount,
  lineItemsAmount,
  lineItem
) {
  if (promotion.type === ApplicationMethodType.PERCENTAGE) {
    return getPromotionValueForPercentage(promotion, lineItemAmount)
  }

  return getPromotionValueForFixed(
    promotion,
    lineItemAmount,
    lineItemsAmount,
    lineItem
  )
}

export function getApplicableQuantity(lineItem, maxQuantity) {
  if (maxQuantity && lineItem.quantity) {
    return MathBN.min(lineItem.quantity, maxQuantity)
  }

  return lineItem.quantity
}

function getLineItemSubtotal(lineItem) {
  return MathBN.div(lineItem.subtotal, lineItem.quantity)
}

function getLineItemOriginalTotal(lineItem) {
  return MathBN.div(lineItem.original_total, lineItem.quantity)
}

// Applied amounts are accumulated excl-tax; convert to incl-tax for tax-inclusive promotions before subtracting.
function getAppliedValueInPromotionBase(promotion, lineItem) {
  if (!promotion.is_tax_inclusive) {
    return promotion.applied_value
  }

  return MathBN.mult(
    promotion.applied_value,
    MathBN.div(lineItem.original_total, lineItem.subtotal)
  )
}

export function calculateAdjustmentAmountFromPromotion(
  lineItem,
  promotion,
  lineItemsAmount: BigNumberInput = 0
) {
  /*
    For a promotion with an across allocation, we consider not only the line item total, but also the total of all other line items in the order.

    We then distribute the promotion value proportionally across the line items based on the total of each line item.

    For example, if the promotion is 100$, and the order total is 400$, and the items are:
      item1: 250$
      item2: 150$
      total: 400$
    
    The promotion value for the line items would be:
      item1: 62.5$
      item2: 37.5$
      total: 100$

    For the next 100$ promotion, we remove the applied promotions value from the line item total and redistribute the promotion value across the line items based on the updated totals.

    Example:
      item1: (250 - 62.5) = 187.5
      item2: (150 - 37.5) = 112.5
      total: 300

      The promotion value for the line items would be:
      item1: $62.5
      item2: $37.5
      total: 100$
  
  */
  if (promotion.allocation === ApplicationMethodAllocation.ACROSS) {
    const quantity = getApplicableQuantity(lineItem, promotion.max_quantity)

    const lineItemAmount = MathBN.mult(
      promotion.is_tax_inclusive
        ? getLineItemOriginalTotal(lineItem)
        : getLineItemSubtotal(lineItem),
      quantity
    )
    const applicableAmount = MathBN.sub(
      lineItemAmount,
      getAppliedValueInPromotionBase(promotion, lineItem)
    )

    if (MathBN.lte(applicableAmount, MEDUSA_EPSILON)) {
      return MathBN.convert(0)
    }

    const promotionValue = getPromotionValue(
      promotion,
      applicableAmount,
      lineItemsAmount,
      lineItem
    )

    const returnValue = MathBN.min(promotionValue, applicableAmount)
    if (MathBN.lte(returnValue, MEDUSA_EPSILON)) {
      return MathBN.convert(0)
    }

    return returnValue
  }

  /*
    For a promotion with an EACH allocation, we calculate the promotion value on the line item as a whole.

    Example:
      item1: {
        subtotal: 200$,
        unit_price: 50$,
        quantity: 4,
      }
      
      When applying promotions, we need to consider 2 values:
        1. What is the maximum promotion value?
        2. What is the maximum promotion we can apply on the line item?
      
      After applying each promotion, we reduce the maximum promotion that you can add to the line item by the value of the promotions applied.
      
      We then apply whichever is lower.
  */

  const remainingItemAmount = MathBN.sub(
    promotion.is_tax_inclusive ? lineItem.original_total : lineItem.subtotal,
    getAppliedValueInPromotionBase(promotion, lineItem)
  )

  const itemAmount = MathBN.div(
    promotion.is_tax_inclusive ? lineItem.original_total : lineItem.subtotal,
    lineItem.quantity
  )

  const maximumPromotionAmount = MathBN.mult(
    itemAmount,
    promotion.max_quantity ?? MathBN.convert(1)
  )

  const applicableAmount = MathBN.min(
    remainingItemAmount,
    maximumPromotionAmount
  )

  if (MathBN.lte(applicableAmount, MEDUSA_EPSILON)) {
    return MathBN.convert(0)
  }

  const promotionValue = getPromotionValue(
    promotion,
    applicableAmount,
    lineItemsAmount,
    lineItem
  )

  const returnValue = MathBN.min(promotionValue, applicableAmount)
  if (MathBN.lte(returnValue, MEDUSA_EPSILON)) {
    return MathBN.convert(0)
  }

  return returnValue
}
