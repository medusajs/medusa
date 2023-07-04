/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface InventoryLevelDTO {
  /**
   * the item location ID
   */
  location_id: string
  /**
   * the total stock quantity of an inventory item at the given location ID
   */
  stocked_quantity: number
  /**
   * the reserved stock quantity of an inventory item at the given location ID
   */
  reserved_quantity: number
  /**
   * the incoming stock quantity of an inventory item at the given location ID
   */
  incoming_quantity: number
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at?: string
}
