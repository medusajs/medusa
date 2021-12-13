import { LineItem } from "../models/line-item"

export type GiftCardAllocation = {
  amount: number
}

export type DiscountAllocation = {
  amount: number
}

export type LineAllocationsMap = {
  [K: string]: { gift_card?: GiftCardAllocation; discount?: DiscountAllocation }
}

export type SubtotalOptions = {
  excludeNonDiscounts?: boolean
}

export type LineDiscount = {
  lineItem: LineItem
  variant: string
  amount: number
}

export type LineDiscountAmount = {
  item: LineItem
  amount: number
}
