/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryLevelDTO } from "./InventoryLevelDTO"

export interface AdminInventoryItemsLocationLevelsRes {
  inventory_item: {
    /**
     * The id of the location
     */
    id: any
    /**
     * List of stock levels at a given location
     */
    location_levels: Array<InventoryLevelDTO>
  }
}
