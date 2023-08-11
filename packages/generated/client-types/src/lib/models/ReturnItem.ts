/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { LineItem } from "./LineItem"
import type { Return } from "./Return"
import type { ReturnReason } from "./ReturnReason"

/**
 * A return item represents a line item in an order that is to be returned. It includes details related to the return and the reason behind it.
 */
export interface ReturnItem {
  /**
   * The ID of the Return that the Return Item belongs to.
   */
  return_id: string
  /**
   * The ID of the Line Item that the Return Item references.
   */
  item_id: string
  /**
   * Details of the Return that the Return Item belongs to.
   */
  return_order?: Return | null
  /**
   * The details of the line item in the original order to be returned.
   */
  item?: LineItem | null
  /**
   * The quantity of the Line Item to be returned.
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
   * The details of the reason for returning the item.
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
