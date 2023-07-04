/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { LineItem } from "./LineItem"
import type { Return } from "./Return"
import type { ReturnReason } from "./ReturnReason"

/**
 * Correlates a Line Item with a Return, keeping track of the quantity of the Line Item that will be returned.
 */
export interface ReturnItem {
  /**
   * The id of the Return that the Return Item belongs to.
   */
  return_id: string
  /**
   * The id of the Line Item that the Return Item references.
   */
  item_id: string
  /**
   * Available if the relation `return_order` is expanded.
   */
  return_order?: Return | null
  /**
   * Available if the relation `item` is expanded.
   */
  item?: LineItem | null
  /**
   * The quantity of the Line Item that is included in the Return.
   */
  quantity: number
  /**
   * Whether the Return Item was requested initially or received unexpectedly in the warehouse.
   */
  is_requested: boolean
  /**
   * The quantity that was originally requested to be returned.
   */
  requested_quantity: number | null
  /**
   * The quantity that was received in the warehouse.
   */
  received_quantity: number | null
  /**
   * The ID of the reason for returning the item.
   */
  reason_id: string | null
  /**
   * Available if the relation `reason` is expanded.
   */
  reason?: ReturnReason | null
  /**
   * An optional note with additional details about the Return.
   */
  note: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
