import { BigNumberValue } from "./big-number"

export * from "./big-number"

export type CartLikeWithTotals = {
  original_item_subtotal: BigNumberValue
  original_item_tax_total: BigNumberValue
  item_total: BigNumberValue
  item_subtotal: BigNumberValue
  item_tax_total: BigNumberValue
  original_total: BigNumberValue
  original_subtotal: BigNumberValue
  original_tax_total: BigNumberValue
  total: BigNumberValue
  subtotal: BigNumberValue
  tax_total: BigNumberValue
  discount_total: BigNumberValue
  discount_tax_total: BigNumberValue
  gift_card_total: BigNumberValue
  gift_card_tax_total: BigNumberValue
  shipping_total: BigNumberValue
  shipping_subtotal: BigNumberValue
  shipping_tax_total: BigNumberValue
  original_shipping_total: BigNumberValue
  original_shipping_subtotal: BigNumberValue
  original_shipping_tax_total: BigNumberValue
}
