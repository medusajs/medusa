/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostReservationsReq {
  /**
   * The id of the location of the reservation
   */
  line_item_id?: string
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
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
}
