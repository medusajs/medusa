/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { LineItem } from "./LineItem"

/**
 * Represents a Line Item Tax Line
 */
export interface LineItemTaxLine {
  /**
   * The line item tax line's ID
   */
  id: string
  /**
   * A code to identify the tax type by
   */
  code: string | null
  /**
   * A human friendly name for the tax
   */
  name: string
  /**
   * The numeric rate to charge tax by
   */
  rate: number
  /**
   * The ID of the line item
   */
  item_id: string
  /**
   * Available if the relation `item` is expanded.
   */
  item?: LineItem | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
