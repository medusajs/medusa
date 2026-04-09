export interface AdminUpdateInventoryLevel {
  /**
   * The associated inventory item's stocked quantity in the
   * associated stock location.
   */
  stocked_quantity?: number
  /**
   * The associated inventory item's incoming quantity in the
   * associated stock location.
   */
  incoming_quantity?: number
}

export interface AdminBatchCreateInventoryItemLocationLevels {
  /**
   * The ID of the associated stock location.
   */
  location_id: string
  /**
   * The associated inventory item's stocked quantity in the
   * associated stock location.
   */
  stocked_quantity?: number
  /**
   * The associated inventory item's incoming quantity in the
   * associated stock location.
   */
  incoming_quantity?: number
}

export interface AdminBatchUpdateInventoryItemLocationLevels
  extends AdminBatchCreateInventoryItemLocationLevels {
  /**
   * The ID of the inventory level to update.
   */
  id?: string
}

export interface AdminBatchInventoryItemLocationLevels {
  /**
   * A list of inventory levels to update.
   */
  update?: AdminBatchUpdateInventoryItemLocationLevels[]
  /**
   * A list of inventory levels to create.
   */
  create?: AdminBatchCreateInventoryItemLocationLevels[]
  /**
   * A list of location IDs to
   * delete their associated inventory
   * levels of the inventory item.
   */
  delete?: string[]
  /**
   * Whether to force the deletion of the inventory levels,
   * even if the location has stocked quantity.
   */
  force?: boolean
}

export interface AdminBatchCreateInventoryItemsLocationLevels {
  /**
   * The ID of the associated stock location.
   */
  location_id: string
  /**
   * The ID of the associated inventory item.
   */
  inventory_item_id: string
  /**
   * The associated inventory item's stocked quantity in the
   * associated stock location.
   */
  stocked_quantity?: number
  /**
   * The associated inventory item's incoming quantity in the
   * associated stock location.
   */
  incoming_quantity?: number
}

export interface AdminBatchUpdateInventoryItemsLocationLevels
  extends AdminBatchCreateInventoryItemsLocationLevels {
  /**
   * The ID of the inventory level to update.
   */
  id?: string
}

/**
 * A list of inventory levels to create, update, or delete.
 */
export interface AdminBatchInventoryItemsLocationLevels {
  /**
   * The inventory levels to create.
   */
  create: AdminBatchCreateInventoryItemsLocationLevels[]
  /**
   * The inventory levels to update.
   */
  update: AdminBatchUpdateInventoryItemsLocationLevels[]
  /**
   * The IDs of the inventory levels to delete.
   */
  delete: string[]
  /**
   * If enabled, the inventory levels will be deleted
   * even if they have stocked quantity.
   */
  force?: boolean
}
