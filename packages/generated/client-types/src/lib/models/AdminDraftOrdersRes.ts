/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Cart } from "./Cart"
import type { Discount } from "./Discount"
import type { DraftOrder } from "./DraftOrder"
import type { LineItem } from "./LineItem"
import type { ProductVariant } from "./ProductVariant"
import type { Region } from "./Region"
import type { ShippingMethod } from "./ShippingMethod"

export interface AdminDraftOrdersRes {
  draft_order: Merge<
    SetRelation<DraftOrder, "order" | "cart">,
    {
      cart: Merge<
        SetRelation<
          Cart,
          | "items"
          | "billing_address"
          | "customer"
          | "discounts"
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
          | "gift_cards"
        >,
        {
          items: Array<
            Merge<
              SetRelation<
                LineItem,
                | "adjustments"
                | "discount_total"
                | "gift_card_total"
                | "original_tax_total"
                | "original_total"
                | "refundable"
                | "subtotal"
                | "tax_total"
                | "total"
                | "tax_lines"
                | "variant"
              >,
              {
                variant: SetRelation<ProductVariant, "product">
              }
            >
          >
          discounts: Array<SetRelation<Discount, "rule">>
          region: SetRelation<
            Region,
            "payment_providers" | "tax_rates" | "fulfillment_providers"
          >
          shipping_methods: Array<
            SetRelation<ShippingMethod, "shipping_option" | "tax_lines">
          >
        }
      >
    }
  >
}
