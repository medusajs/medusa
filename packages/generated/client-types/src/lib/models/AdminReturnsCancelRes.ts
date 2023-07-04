/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ClaimItem } from "./ClaimItem"
import type { ClaimOrder } from "./ClaimOrder"
import type { Discount } from "./Discount"
import type { Fulfillment } from "./Fulfillment"
import type { LineItem } from "./LineItem"
import type { Order } from "./Order"
import type { Return } from "./Return"
import type { ReturnItem } from "./ReturnItem"
import type { ShippingMethod } from "./ShippingMethod"
import type { Swap } from "./Swap"

export interface AdminReturnsCancelRes {
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
            additional_items: Array<SetRelation<LineItem, "variant">>
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
      returns: Array<
        Merge<
          SetRelation<Return, "items" | "shipping_method">,
          {
            items: Array<SetRelation<ReturnItem, "reason">>
            shipping_method: SetRelation<ShippingMethod, "tax_lines">
          }
        >
      >
      swaps: Array<
        Merge<
          SetRelation<
            Swap,
            | "additional_items"
            | "fulfillments"
            | "payment"
            | "return_order"
            | "shipping_address"
            | "shipping_methods"
          >,
          {
            additional_items: Array<SetRelation<LineItem, "variant">>
            fulfillments: Array<SetRelation<Fulfillment, "tracking_links">>
            return_order: Merge<
              SetRelation<Return, "shipping_method">,
              {
                shipping_method: SetRelation<ShippingMethod, "tax_lines">
              }
            >
            shipping_methods: Array<SetRelation<ShippingMethod, "tax_lines">>
          }
        >
      >
    }
  >
}
