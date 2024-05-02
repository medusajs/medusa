/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryItemDTO } from "./InventoryItemDTO"

/**
 * The inventory item's details.
 */
export interface AdminInventoryItemsRes {
  /**
   * Inventory Item details
   */
  inventory_item: InventoryItemDTO
}
