/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryItemDTO } from "./InventoryItemDTO"
import type { InventoryLevelDTO } from "./InventoryLevelDTO"
import type { ProductVariant } from "./ProductVariant"

export interface AdminInventoryItemsListWithVariantsAndLocationLevelsRes {
  inventory_items: Array<
    InventoryItemDTO & {
      location_levels?: Array<InventoryLevelDTO>
      variants?: Array<ProductVariant>
    }
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
