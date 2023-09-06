/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Discount } from "./Discount"
import type { LineItem } from "./LineItem"

/**
 * A Line Item Adjustment includes details on discounts applied on a line item.
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
   * The details of the line item.
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
   * The details of the discount associated with the adjustment.
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
