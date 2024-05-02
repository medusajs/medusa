import { BaseFilterable, OperatorMap } from "../../dal"

/**
 * The inventory level details.
 */
export interface InventoryLevelDTO {
  /**
   * The ID of the inventory level.
   */
  id: string

  /**
   * The associated inventory item's ID.
   */
  inventory_item_id: string

  /**
   * The associated location's ID.
   */
  location_id: string

  /**
   * The stocked quantity of the inventory level.
   */
  stocked_quantity: number

  /**
   * The reserved quantity of the inventory level.
   */
  reserved_quantity: number

  /**
   * The incoming quantity of the inventory level.
   */
  incoming_quantity: number

  /**
   * The available quantity of the inventory level.
   */
  available_quantity: number

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The creation date of the inventory level.
   */
  created_at: string | Date

  /**
   * The update date of the inventory level.
   */
  updated_at: string | Date

  /**
   * The deletion date of the inventory level.
   */
  deleted_at: string | Date | null
}

/**
 * The filters to apply on the retrieved inventory levels.
 */
export interface FilterableInventoryLevelProps
  extends BaseFilterable<FilterableInventoryLevelProps> {
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
  stocked_quantity?: number | OperatorMap<Number>

  /**
   * Filters to apply on inventory levels' `reserved_quantity` attribute.
   */
  reserved_quantity?: number | OperatorMap<Number>

  /**
   * Filters to apply on inventory levels' `incoming_quantity` attribute.
   */
  incoming_quantity?: number | OperatorMap<Number>
}
