/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { DecoratedInventoryItemDTO } from "./DecoratedInventoryItemDTO"

export interface AdminInventoryItemsListWithVariantsAndLocationLevelsRes {
  /**
   * an array of Inventory Item details
   */
  inventory_items: Array<DecoratedInventoryItemDTO>
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
