/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ClaimOrder } from "./ClaimOrder"
import type { Discount } from "./Discount"
import type { Fulfillment } from "./Fulfillment"
import type { GiftCardTransaction } from "./GiftCardTransaction"
import type { LineItem } from "./LineItem"
import type { Order } from "./Order"
import type { ProductVariant } from "./ProductVariant"
import type { Region } from "./Region"
import type { ShippingMethod } from "./ShippingMethod"
import type { Swap } from "./Swap"

export interface StoreOrdersRes {
  order: Merge<
    SetRelation<
      Order,
      | "customer"
      | "discounts"
      | "fulfillments"
      | "items"
      | "payments"
      | "region"
      | "shipping_address"
      | "shipping_methods"
      | "discount_total"
      | "gift_card_tax_total"
      | "gift_card_total"
      | "paid_total"
      | "refundable_amount"
      | "refunded_total"
      | "shipping_total"
      | "subtotal"
      | "tax_total"
      | "total"
      | "claims"
      | "swaps"
      | "gift_card_transactions"
      | "gift_cards"
      | "refunds"
    >,
    {
      discounts: Array<SetRelation<Discount, "rule">>
      fulfillments: Array<SetRelation<Fulfillment, "tracking_links" | "items">>
      items: Array<
        Merge<
          SetRelation<
            LineItem,
            | "variant"
            | "discount_total"
            | "gift_card_total"
            | "original_tax_total"
            | "original_total"
            | "refundable"
            | "subtotal"
            | "tax_total"
            | "total"
            | "adjustments"
            | "tax_lines"
          >,
          {
            variant: SetRelation<ProductVariant, "product">
          }
        >
      >
      region: SetRelation<Region, "fulfillment_providers" | "payment_providers">
      shipping_methods: Array<
        SetRelation<ShippingMethod, "tax_lines" | "shipping_option">
      >
      claims: Array<
        Merge<
          SetRelation<ClaimOrder, "additional_items">,
          {
            additional_items: Array<
              SetRelation<
                LineItem,
                | "discount_total"
                | "gift_card_total"
                | "original_tax_total"
                | "original_total"
                | "refundable"
                | "subtotal"
                | "tax_total"
                | "total"
                | "adjustments"
                | "tax_lines"
              >
            >
          }
        >
      >
      swaps: Array<
        Merge<
          SetRelation<Swap, "additional_items">,
          {
            additional_items: Array<
              SetRelation<
                LineItem,
                | "discount_total"
                | "gift_card_total"
                | "original_tax_total"
                | "original_total"
                | "refundable"
                | "subtotal"
                | "tax_total"
                | "total"
                | "adjustments"
                | "tax_lines"
              >
            >
          }
        >
      >
      gift_card_transactions: Array<
        SetRelation<GiftCardTransaction, "gift_card">
      >
    }
  >
}
