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
  quantity?: number
  /**
   * The ID of the associated location.
   */
  location_id?: string
  /**
   * The description of the reservation item.
   */
  description?: string
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
  line_item_id?: string
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
  quantity: number
  /**
   * The description of the reservation.
   */
  description?: string
  /**
   * The user or system that created the reservation. Can be any form of identification string.
   */
  created_by?: string
  /**
   * An ID associated with an external third-party system that the reservation item is connected to.
   */
  external_id?: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

export interface ReserveQuantityContext {
  locationId?: string
  lineItemId?: string
  salesChannelId?: string | null
}
