import {
  NumericalComparisonOperator,
  StringComparisonOperator,
} from "../../common"

/**
 * The reservation item details.
 */
export interface ReservationItemDTO {
  /**
   * The ID of the reservation item.
   */
  id: string

  /**
   * The associated location's ID.
   */
  location_id: string

  /**
   * The associated inventory item's ID.
   */
  inventory_item_id: string

  /**
   * The quantity of the reservation item.
   */
  quantity: number

  /**
   * The associated line item's ID.
   */
  line_item_id?: string | null

  /**
   * The description of the reservation item.
   */
  description?: string | null

  /**
   * Allow backorder of the item. If true, it won't check inventory levels before reserving it.
   */
  allow_backorder?: boolean

  /**
   * The created by of the reservation item.
   */
  created_by?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The creation date of the reservation item.
   */
  created_at: string | Date

  /**
   * The update date of the reservation item.
   */
  updated_at: string | Date

  /**
   * The deletion date of the reservation item.
   */
  deleted_at: string | Date | null
}

/**
 * @interface
 *
 * The filters to apply on retrieved reservation items.
 */
export interface FilterableReservationItemProps {
  /**
   * The IDs to filter reservation items by.
   */
  id?: string | string[]

  /**
   * @ignore
   *
   * @privateRemarks
   * This property is not used.
   */
  type?: string | string[]

  /**
   * Filter reservation items by the ID of their associated line item.
   */
  line_item_id?: string | string[]

  /**
   * Filter reservation items by the ID of their associated inventory item.
   */
  inventory_item_id?: string | string[]

  /**
   * Filter reservation items by the ID of their associated location.
   */
  location_id?: string | string[]

  /**
   * Description filters to apply on the reservation items' `description` attribute.
   */
  description?: string | StringComparisonOperator

  /**
   * The "created by" values to filter reservation items by.
   */
  created_by?: string | string[]

  /**
   * Filters to apply on the reservation items' `quantity` attribute.
   */
  quantity?: number | NumericalComparisonOperator
}
