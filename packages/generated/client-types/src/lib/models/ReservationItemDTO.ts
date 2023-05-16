/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Represents a reservation of an inventory item at a stock location
 */
export interface ReservationItemDTO {
  /**
   * The id of the reservation item
   */
  id: string
  /**
   * The id of the location of the reservation
   */
  location_id: string
  /**
   * The id of the inventory item the reservation relates to
   */
  inventory_item_id: string
  /**
   * The id of the reservation item
   */
  quantity: number
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
