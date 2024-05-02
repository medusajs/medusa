/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryLevelDTO } from "./InventoryLevelDTO"

/**
 * Details of inventory items and their associated location levels.
 */
export interface AdminInventoryItemsLocationLevelsRes {
  /**
   * An inventory item's ID and associated location levels.
   */
  inventory_item: {
    /**
     * The id of the location
     */
    id: string
    /**
     * List of stock levels at a given location
     */
    location_levels: Array<InventoryLevelDTO>
  }
}
