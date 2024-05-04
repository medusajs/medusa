/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { LineItem } from "./LineItem"
import type { OrderEdit } from "./OrderEdit"
import type { OrderItemChange } from "./OrderItemChange"

/**
 * The list of order edits with pagination fields.
 */
export interface AdminOrderEditsListRes {
  /**
   * An array of order edit details
   */
  order_edits: Array<
    Merge<
      SetRelation<
        OrderEdit,
        | "changes"
        | "items"
        | "payment_collection"
        | "difference_due"
        | "discount_total"
        | "gift_card_tax_total"
        | "gift_card_total"
        | "shipping_total"
        | "subtotal"
        | "tax_total"
        | "total"
      >,
      {
        changes: Array<
          Merge<
            SetRelation<OrderItemChange, "line_item" | "original_line_item">,
            {
              line_item: SetRelation<LineItem, "variant">
              original_line_item: SetRelation<LineItem, "variant">
            }
          >
        >
        items: Array<
          SetRelation<
            LineItem,
            | "adjustments"
            | "tax_lines"
            | "variant"
            | "discount_total"
            | "gift_card_total"
            | "original_tax_total"
            | "original_total"
            | "refundable"
            | "subtotal"
            | "tax_total"
            | "total"
          >
        >
      }
    >
  >
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of order edits skipped when retrieving the order edits.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
