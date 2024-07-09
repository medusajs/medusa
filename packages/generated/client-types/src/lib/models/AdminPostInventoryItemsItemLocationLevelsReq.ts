/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the inventory level to create.
 */
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
