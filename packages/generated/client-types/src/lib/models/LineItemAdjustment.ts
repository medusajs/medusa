/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Discount } from "./Discount"
import type { LineItem } from "./LineItem"

/**
 * Represents a Line Item Adjustment
 */
export interface LineItemAdjustment {
  /**
   * The Line Item Adjustment's ID
   */
  id: string
  /**
   * The ID of the line item
   */
  item_id: string
  /**
   * Available if the relation `item` is expanded.
   */
  item?: LineItem | null
  /**
   * The line item's adjustment description
   */
  description: string
  /**
   * The ID of the discount associated with the adjustment
   */
  discount_id: string | null
  /**
   * Available if the relation `discount` is expanded.
   */
  discount?: Discount | null
  /**
   * The adjustment amount
   */
  amount: number
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
