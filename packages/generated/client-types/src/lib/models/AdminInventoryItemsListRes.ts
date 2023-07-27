/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryItemDTO } from "./InventoryItemDTO"

export interface AdminInventoryItemsListRes {
  /**
   * an array of Inventory Item details
   */
  inventory_items: Array<InventoryItemDTO>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of inventory items skipped when retrieving the inventory items.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
