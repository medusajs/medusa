/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Cart } from "./Cart"
import type { DraftOrder } from "./DraftOrder"
import type { LineItem } from "./LineItem"

export interface AdminDraftOrdersListRes {
  draft_orders: Array<
    Merge<
      SetRelation<DraftOrder, "order" | "cart">,
      {
        cart: Merge<
          SetRelation<Cart, "items">,
          {
            items: Array<SetRelation<LineItem, "adjustments">>
          }
        >
      }
    >
  >
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of items skipped before these items
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
