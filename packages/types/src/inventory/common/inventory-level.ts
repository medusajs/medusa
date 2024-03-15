import { NumericalComparisonOperator } from "../../common"

/**
 * @schema InventoryLevelDTO
 * type: object
 * required:
 *   - inventory_item_id
 *   - location_id
 *   - stocked_quantity
 *   - reserved_quantity
 *   - incoming_quantity
 * properties:
 *   location_id:
 *     description: the item location ID
 *     type: string
 *   stocked_quantity:
 *     description: the total stock quantity of an inventory item at the given location ID
 *     type: number
 *   reserved_quantity:
 *     description: the reserved stock quantity of an inventory item at the given location ID
 *     type: number
 *   incoming_quantity:
 *     description: the incoming stock quantity of an inventory item at the given location ID
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
export interface InventoryLevelDTO {
  id: string
  inventory_item_id: string
  location_id: string
  stocked_quantity: number
  reserved_quantity: number
  incoming_quantity: number
  available_quantity: number
  metadata: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date | null
}

export interface FilterableInventoryLevelProps {
  /**
   * Filter inventory levels by the ID of their associated inventory item.
   */
  inventory_item_id?: string | string[]
  /**
   * Filter inventory levels by the ID of their associated inventory location.
   */
  location_id?: string | string[]
  /**
   * Filters to apply on inventory levels' `stocked_quantity` attribute.
   */
  stocked_quantity?: number | NumericalComparisonOperator
  /**
   * Filters to apply on inventory levels' `reserved_quantity` attribute.
   */
  reserved_quantity?: number | NumericalComparisonOperator
  /**
   * Filters to apply on inventory levels' `incoming_quantity` attribute.
   */
  incoming_quantity?: number | NumericalComparisonOperator
}
