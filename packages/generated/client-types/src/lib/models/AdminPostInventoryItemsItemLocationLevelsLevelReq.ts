/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostInventoryItemsItemLocationLevelsLevelReq {
  /**
   * the total stock quantity of an inventory item at the specified inventory level
   */
  stocked_quantity?: number
  /**
   * the incoming stock quantity of an inventory item at the specified inventory level
   */
  incoming_quantity?: number
}
