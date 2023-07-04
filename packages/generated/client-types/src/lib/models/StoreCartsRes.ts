/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Cart } from "./Cart"
import type { Discount } from "./Discount"
import type { LineItem } from "./LineItem"
import type { ProductVariant } from "./ProductVariant"
import type { Region } from "./Region"
import type { ShippingMethod } from "./ShippingMethod"

export interface StoreCartsRes {
  cart: Merge<
    SetRelation<
      Cart,
      | "billing_address"
      | "discounts"
      | "gift_cards"
      | "items"
      | "payment"
      | "payment_sessions"
      | "region"
      | "shipping_address"
      | "shipping_methods"
      | "discount_total"
      | "gift_card_tax_total"
      | "gift_card_total"
      | "item_tax_total"
      | "refundable_amount"
      | "refunded_total"
      | "shipping_tax_total"
      | "shipping_total"
      | "subtotal"
      | "tax_total"
      | "total"
    >,
    {
      discounts: Array<SetRelation<Discount, "rule">>
      items: Array<
        Merge<
          SetRelation<
            LineItem,
            | "adjustments"
            | "variant"
            | "discount_total"
            | "gift_card_total"
            | "original_tax_total"
            | "original_total"
            | "refundable"
            | "subtotal"
            | "tax_total"
            | "total"
            | "tax_lines"
          >,
          {
            variant: SetRelation<ProductVariant, "product">
          }
        >
      >
      region: SetRelation<
        Region,
        | "countries"
        | "payment_providers"
        | "tax_rates"
        | "fulfillment_providers"
      >
      shipping_methods: Array<
        SetRelation<ShippingMethod, "tax_lines" | "shipping_option">
      >
    }
  >
}
