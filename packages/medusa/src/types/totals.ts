import { LineItem } from "../models/line-item"

/** The amount of a gift card allocated to a line item */
export type GiftCardAllocation = {
  amount: number
  unit_amount: number
}

/** The amount of a discount allocated to a line item */
export type DiscountAllocation = {
  amount: number
  unit_amount: number
}

/**
 * A map of line item ids and its corresponding gift card and discount
 * allocations
 */
export type LineAllocationsMap = {
  [K: string]: { gift_card?: GiftCardAllocation; discount?: DiscountAllocation }
}

/**
 * Options to use for subtotal calculations
 */
export type SubtotalOptions = {
  excludeNonDiscounts?: boolean
}

/**
 * Associates a line item and discount allocation.
 */
export type LineDiscount = {
  lineItem: LineItem
  variant: string
  amount: number
}

/**
 * Associates a line item and discount allocation.
 */
export type LineDiscountAmount = {
  item: LineItem
  amount: number
}
