export interface AdminCreateInventoryItem {
  /**
   * The inventory item's SKU.
   */
  sku?: string | null
  /**
   * The inventory item's HS code.
   */
  hs_code?: string | null
  /**
   * The inventory item's weight.
   */
  weight?: number | null
  /**
   * The inventory item's length.
   */
  length?: number | null
  /**
   * The inventory item's height.
   */
  height?: number | null
  /**
   * The inventory item's width.
   */
  width?: number | null
  /**
   * The inventory item's origin country.
   */
  origin_country?: string | null
  /**
   * The inventory item's MID code.
   */
  mid_code?: string | null
  /**
   * The inventory item's material.
   */
  material?: string | null
  /**
   * The inventory item's title.
   */
  title?: string | null
  /**
   * The inventory item's description.
   */
  description?: string | null
  /**
   * Whether the inventory item requires shipping.
   */
  requires_shipping?: boolean
  /**
   * The inventory item's thumbnail URL.
   */
  thumbnail?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The inventory item's location levels.
   */
  location_levels?: AdminBatchCreateInventoryItemLocationLevels[]
}

export interface AdminUpdateInventoryItem extends Omit<AdminCreateInventoryItem, "location_levels"> {}

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
  create?: AdminBatchCreateInventoryItemsLocationLevels[]
  /**
   * The inventory levels to update.
   */
  update?: AdminBatchUpdateInventoryItemsLocationLevels[]
  /**
   * The IDs of the inventory levels to delete.
   */
  delete?: string[]
  /**
   * If enabled, the inventory levels will be deleted
   * even if they have stocked quantity.
   */
  force?: boolean
}

