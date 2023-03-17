/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryItemDTO } from "./InventoryItemDTO"

export interface AdminInventoryItemsListRes {
  inventory_items: Array<InventoryItemDTO>
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
