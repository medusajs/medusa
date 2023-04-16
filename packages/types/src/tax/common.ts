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
