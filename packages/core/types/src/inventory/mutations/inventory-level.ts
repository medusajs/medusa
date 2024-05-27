export interface CreateInventoryLevelInput {
  /**
   * The ID of the associated inventory item.
   */
  inventory_item_id: string
  /**
   * The ID of the associated location.
   */
  location_id: string
  /**
   * The stocked quantity of the associated inventory item in the associated location.
   */
  stocked_quantity?: number
  /**
   * The reserved quantity of the associated inventory item in the associated location.
   */
  reserved_quantity?: number
  /**
   * The incoming quantity of the associated inventory item in the associated location.
   */
  incoming_quantity?: number
}

/**
 * @interface
 *
 * The attributes to update in an inventory level.
 */
export interface UpdateInventoryLevelInput {
  /**
   * id of the inventory level to update
   */
  id?: string
  /**
   * The stocked quantity of the associated inventory item in the associated location.
   */
  stocked_quantity?: number
  /**
   * The incoming quantity of the associated inventory item in the associated location.
   */
  incoming_quantity?: number
}

/**
 * @interface
 *
 * The attributes to update in an inventory level. The inventory level is identified by the IDs of its associated inventory item and location.
 */
export type BulkUpdateInventoryLevelInput = {
  /**
   * The ID of the associated inventory level.
   */
  inventory_item_id: string
  /**
   * The ID of the associated location.
   */
  location_id: string
} & UpdateInventoryLevelInput

export type BulkAdjustInventoryLevelInput = {
  /**
   * The ID of the associated inventory level.
   */
  inventory_item_id: string
  /**
   * The ID of the associated location.
   */
  location_id: string

  /**
   * The quantity to adjust the inventory level by.
   */
  adjustment: number // TODO: BigNumberInput
} & UpdateInventoryLevelInput
