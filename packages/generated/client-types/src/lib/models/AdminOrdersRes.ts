/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ClaimItem } from "./ClaimItem"
import type { ClaimOrder } from "./ClaimOrder"
import type { Discount } from "./Discount"
import type { Fulfillment } from "./Fulfillment"
import type { GiftCardTransaction } from "./GiftCardTransaction"
import type { LineItem } from "./LineItem"
import type { Order } from "./Order"
import type { ProductVariant } from "./ProductVariant"
import type { Region } from "./Region"
import type { Return } from "./Return"
import type { ReturnItem } from "./ReturnItem"
import type { ShippingMethod } from "./ShippingMethod"
import type { Swap } from "./Swap"

export interface AdminOrdersRes {
  order: Merge<
    SetRelation<
      Order,
      | "billing_address"
      | "claims"
      | "customer"
      | "discounts"
      | "fulfillments"
      | "gift_card_transactions"
      | "gift_cards"
      | "items"
      | "payments"
      | "refunds"
      | "region"
      | "returns"
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
      | "swaps"
    >,
    {
      claims: Array<
        Merge<
          SetRelation<
            ClaimOrder,
            | "additional_items"
            | "claim_items"
            | "fulfillments"
            | "return_order"
            | "shipping_address"
            | "shipping_methods"
          >,
          {
            additional_items: Array<
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
              >
            >
            claim_items: Array<SetRelation<ClaimItem, "images" | "item">>
            fulfillments: Array<SetRelation<Fulfillment, "tracking_links">>
            return_order: Merge<
              SetRelation<Return, "shipping_method">,
              {
                shipping_method: SetRelation<ShippingMethod, "tax_lines">
              }
            >
          }
        >
      >
      discounts: Array<SetRelation<Discount, "rule">>
      fulfillments: Array<SetRelation<Fulfillment, "items" | "tracking_links">>
      gift_card_transactions: Array<
        SetRelation<GiftCardTransaction, "gift_card">
      >
      items: Array<
        Merge<
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
            | "variant"
          >,
          {
            variant: SetRelation<ProductVariant, "product">
          }
        >
      >
      region: SetRelation<Region, "fulfillment_providers" | "payment_providers">
      returns: Array<
        Merge<
          SetRelation<Return, "items" | "shipping_method">,
          {
            items: Array<SetRelation<ReturnItem, "reason">>
            shipping_method: SetRelation<ShippingMethod, "tax_lines">
          }
        >
      >
      shipping_methods: Array<
        SetRelation<ShippingMethod, "tax_lines" | "shipping_option">
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
    }
  >
}
