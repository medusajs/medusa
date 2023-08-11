/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryItemDTO } from "./InventoryItemDTO"

export type ResponseInventoryItem = InventoryItemDTO & {
  /**
   * The inventory's location levels.
   */
  location_levels?: Array<
    InventoryItemDTO & {
      /**
       * The available quantity in the inventory location.
       */
      available_quantity: number
    }
  >
}
