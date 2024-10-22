export interface InventoryLevel {
  /**
   * The inventory level's ID.
   */
  id: string
  /**
   * The ID of the associated inventory item.
   */
  inventory_item_id: string
  /**
   * The ID of the associated stock location
   */
  location_id: string
  /**
   * The associated inventory item's stocked quantity in the
   * associated stock location.
   */
  stocked_quantity: number
  /**
   * The associated inventory item's reserved quantity in the
   * associated stock location.
   */
  reserved_quantity: number
  /**
   * The associated inventory item's available quantity in the
   * associated stock location.
   */
  available_quantity: number
  /**
   * The associated inventory item's incoming quantity in the
   * associated stock location.
   */
  incoming_quantity: number
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}
