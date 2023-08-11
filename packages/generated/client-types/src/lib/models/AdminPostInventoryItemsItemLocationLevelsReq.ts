/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostInventoryItemsItemLocationLevelsReq {
  /**
   * the ID of the stock location
   */
  location_id: string
  /**
   * the stock quantity of the inventory item at this location
   */
  stocked_quantity: number
  /**
   * the incoming stock quantity of the inventory item at this location
   */
  incoming_quantity?: number
}
