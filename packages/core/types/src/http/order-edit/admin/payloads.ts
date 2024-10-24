export interface AdminInitiateOrderEditRequest {
  /**
   * The ID of the order to create the edit for.
   */
  order_id: string
  /**
   * The order edit's description.
   */
  description?: string
  /**
   * An internal note viewed by admin users only.
   */
  internal_note?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
}

export interface AdminAddOrderEditItems {
  /**
   * The details of the items to add.
   */
  items: {
    /**
     * The ID of the product variant to add.
     */
    variant_id: string
    /**
     * The item's quantity.
     */
    quantity: number
    /**
     * A custom price to use for the item.
     */
    unit_price?: number
    /**
     * An internal note viewed by admin users only.
     */
    internal_note?: string
    /**
     * Whether the variant can be added even if it's out of stock.
     */
    allow_backorder?: boolean
    /**
     * Key-value pairs of custom data.
     */
    metadata?: Record<string, unknown>
  }[]
}

export interface AdminUpdateOrderEditItem {
  /**
   * The item's quantity.
   */
  quantity?: number
  /**
   * An internal note viewed by admin users only.
   */
  internal_note?: string | null
}
