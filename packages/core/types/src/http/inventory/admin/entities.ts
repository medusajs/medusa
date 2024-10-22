export interface AdminInventoryItem {
  /**
   * The inventory item's ID.
   */
  id: string
  /**
   * The inventory item's SKU.
   */
  sku?: string | null
  /**
   * The inventory item's origin country.
   */
  origin_country?: string | null
  /**
   * The inventory item's HS code.
   */
  hs_code?: string | null
  /**
   * Whether the item requires shipping.
   */
  requires_shipping: boolean
  /**
   * The inventory item's MID code.
   */
  mid_code?: string | null
  /**
   * The inventory item's material.
   */
  material?: string | null
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
   * The inventory item's title.
   */
  title?: string | null
  /**
   * The inventory item's description.
   */
  description?: string | null
  /**
   * The inventory item's thumbnail URL.
   */
  thumbnail?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The item's associated inventory levels.
   */
  location_levels?: AdminInventoryLevel[]
}

export interface AdminInventoryLevel {
  /**
   * The inventory level's ID.
   */
  id: string
  /**
   * The date the inventory level was created.
   */
  created_at: Date
  /**
   * The date the inventory level was updated.
   */
  updated_at: Date
  /**
   * The date the inventory level was deleted.
   */
  deleted_at: Date | null
  /**
   * The ID of the associated inventory item.
   */
  inventory_item_id: string
  /**
   * The ID of the associated stock location.
   */
  location_id: string
  /**
   * The associated inventory item's stocked quantity in the associated location.
   */
  stocked_quantity: number
  /**
   * The associated inventory item's reserved quantity in the associated location.
   */
  reserved_quantity: number
  /**
   * The associated inventory item's incoming quantity in the associated location.
   */
  incoming_quantity: number
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
  /**
   * The associated inventory item.
   */
  inventory_item?: AdminInventoryItem
  /**
   * The associated inventory item's available quantity in the associated location.
   */
  available_quantity: number | null
}
