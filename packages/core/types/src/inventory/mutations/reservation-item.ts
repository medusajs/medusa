import { BigNumberInput } from "../../totals"

/**
 * @interface
 *
 * The attributes to update in a reservation item.
 */
export interface UpdateReservationItemInput {
  id: string
  /**
   * The reserved quantity.
   */
  quantity?: BigNumberInput
  /**
   * The ID of the associated location.
   */
  location_id?: string
  /**
   * The description of the reservation item.
   */
  description?: string | null
  /**
   * Allow backorder of the item. If true, it won't check inventory levels before reserving it.
   */
  allow_backorder?: boolean
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * @interface
 *
 * The details of the reservation item to be created.
 */
export interface CreateReservationItemInput {
  /**
   * The ID of the associated line item.
   */
  line_item_id?: string | null
  /**
   * The ID of the associated inventory item.
   */
  inventory_item_id: string
  /**
   * The ID of the associated location.
   */
  location_id: string
  /**
   * The reserved quantity.
   */
  quantity: BigNumberInput
  /**
   * Allow backorder of the item. If true, it won't check inventory levels before reserving it.
   */
  allow_backorder?: boolean
  /**
   * The description of the reservation.
   */
  description?: string | null
  /**
   * The user or system that created the reservation. Can be any form of identification string.
   */
  created_by?: string | null
  /**
   * An ID associated with an external third-party system that the reservation item is connected to.
   */
  external_id?: string | null
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

export interface ReserveQuantityContext {
  locationId?: string | null
  lineItemId?: string | null
  salesChannelId?: string | null
}
