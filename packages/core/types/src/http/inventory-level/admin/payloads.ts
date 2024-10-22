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

export interface AdminCreateInventoryLevel {
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

export interface AdminBatchUpdateInventoryLevelLocation {
  /**
   * A list of location IDs to
   * delete their associated inventory 
   * levels of the inventory item.
   */
  delete?: string[]
  /**
   * @ignore
   */
  update?: never // TODO - not implemented // AdminUpdateInventoryLevel[]
  /**
   * A list of inventory levels to create.
   */
  create?: AdminCreateInventoryLevel[]
}
