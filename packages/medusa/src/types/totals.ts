import {
  Address,
  ClaimOrder,
  Customer,
  Discount,
  LineItem,
  Region,
  ShippingMethod,
  Swap,
} from "../models"

export type CalculationContextData = {
  discounts: Discount[]
  items: LineItem[]
  customer: Customer
  region: Region
  shipping_address: Address | null
  swaps?: Swap[]
  claims?: ClaimOrder[]
  shipping_methods?: ShippingMethod[]
}

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
  [K: string]: {
    /**
     * The gift card applied on the line item.
     */
    gift_card?: GiftCardAllocation
    /**
     * The discount applied on the line item.
     */
    discount?: DiscountAllocation
  }
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
  customAdjustmentsAmount: number
}
