/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { LineItem } from "./LineItem"
import type { OrderEdit } from "./OrderEdit"

/**
 * An order item change is a change made within an order edit to an order's items. These changes are not reflected on the original order until the order edit is confirmed.
 */
export interface OrderItemChange {
  /**
   * The order item change's ID
   */
  id: string
  /**
   * The order item change's status
   */
  type: "item_add" | "item_remove" | "item_update"
  /**
   * The ID of the order edit
   */
  order_edit_id: string
  /**
   * The details of the order edit the item change is associated with.
   */
  order_edit?: OrderEdit | null
  /**
   * The ID of the original line item in the order
   */
  original_line_item_id: string | null
  /**
   * The details of the original line item this item change references. This is used if the item change updates or deletes the original item.
   */
  original_line_item?: LineItem | null
  /**
   * The ID of the cloned line item.
   */
  line_item_id: string | null
  /**
   * The details of the resulting line item after the item change. This line item is then used in the original order once the order edit is confirmed.
   */
  line_item?: LineItem | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
}
