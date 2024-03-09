import {
  NumericalComparisonOperator,
  StringComparisonOperator,
} from "../../common"

/**
 * @schema ReservationItemDTO
 * title: "Reservation item"
 * description: "Represents a reservation of an inventory item at a stock location"
 * type: object
 * required:
 * - id
 * - location_id
 * - inventory_item_id
 * - quantity
 * properties:
 *   id:
 *     description: "The id of the reservation item"
 *     type: string
 *   location_id:
 *     description: "The id of the location of the reservation"
 *     type: string
 *   inventory_item_id:
 *     description: "The id of the inventory item the reservation relates to"
 *     type: string
 *   description:
 *     description: "Description of the reservation item"
 *     type: string
 *   created_by:
 *     description: "UserId of user who created the reservation item"
 *     type: string
 *   quantity:
 *     description: "The id of the reservation item"
 *     type: number
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 */
export interface ReservationItemDTO {
  id: string
  location_id: string
  inventory_item_id: string
  quantity: number
  line_item_id?: string | null
  description?: string | null
  created_by?: string | null
  metadata: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
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
   * @privateRemark
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
