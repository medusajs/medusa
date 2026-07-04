export interface AdminInitiateReturnRequest {
  /**
   * The ID of the order that the return belongs to.
   */
  order_id: string
  /**
   * The ID of the stock location to return the items to.
   */
  location_id?: string
  /**
   * The return's description.
   */
  description?: string
  /**
   * A note that is viewed by admins only to
   * describe the return.
   */
  internal_note?: string
  /**
   * Whether to send a notification to the customer
   * for return updates.
   */
  no_notification?: boolean
  /**
   * Custom key-value pairs that can be added to the return.
   */
  metadata?: Record<string, unknown>
}

export interface AdminAddReturnItem {
  /**
   * The ID of the order item to add to the return.
   */
  id: string
  /**
   * The quantity of the item to return.
   */
  quantity: number
  /**
   * A note to describe why the item is being returned.
   */
  description?: string
  /**
   * A note that is viewed by admins only to
   * describe why the item is being returned.
   */
  internal_note?: string
  /**
   * Custom key-value pairs that can be added to the return item.
   */
  metadata?: Record<string, unknown>
}

export interface AdminAddReturnItems {
  items: AdminAddReturnItem[]
}

export interface AdminUpdateReturnItems {
  /**
   * The quantity of the item to return.
   */
  quantity?: number
  /**
   * A note that is viewed by admins only to
   * describe why the item is being returned.
   */
  internal_note?: string | null
  /**
   * The ID of the return reason to associate with the item.
   */
  reason_id?: string | null
  /**
   * Custom key-value pairs that can be added to the return item.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminAddReturnShipping {
  /**
   * The ID of the shipping option that the shipping method
   * is created from.
   */
  shipping_option_id: string
  /**
   * A custom amount to set for the shipping method.
   * If not provided, the shipping option's fixed or calculated amount will be used.
   */
  custom_amount?: number
  /**
   * A note to describe the shipping method.
   */
  description?: string
  /**
   * A note that is viewed by admins only to
   * describe the shipping method.
   */
  internal_note?: string
  /**
   * Custom key-value pairs that can be added to the shipping method.
   */
  metadata?: Record<string, unknown>
}

export interface AdminUpdateReturnShipping {
  /**
   * A custom amount to set for the shipping method.
   * If not provided, the shipping option's fixed or calculated amount will be used.
   */
  custom_amount?: number
  /**
   * A note that is viewed by admins only to
   * describe the shipping method.
   */
  internal_note?: string
  /**
   * Custom key-value pairs that can be added to the shipping method.
   */
  metadata?: Record<string, unknown>
}

export interface AdminConfirmReturnRequest {
  /**
   * Whether to send a notification to the customer
   * for return updates.
   */
  no_notification?: boolean
}

export interface AdminUpdateReturnRequest {
  /**
   * The ID of the stock location to return the items to.
   */
  location_id?: string | null
  /**
   * Whether to send a notification to the customer
   * for return updates.
   */
  no_notification?: boolean
  /**
   * Custom key-value pairs that can be added to the return.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminConfirmReceiveReturn {
  /**
   * Whether to send a notification to the customer
   * for return updates.
   */
  no_notification?: boolean
}

export interface AdminInitiateReceiveReturn {
  /**
   * A note that is viewed by admins only to
   * describe the return.
   */
  internal_note?: string
  /**
   * A note to describe the return.
   */
  description?: string
  /**
   * Custom key-value pairs that can be added to the return.
   */
  metadata?: Record<string, unknown>
}

export interface AdminReceiveItems {
  /**
   * The received items in the return.
   */
  items: { 
    /**
     * The ID of the received item.
     */
    id: string; 
    /**
     * The received quantity of the item.
     */
    quantity: number; 
    /**
     * A note that is viewed by admins only to
     * describe the received item.
     */
    internal_note?: string
    /**
     * The description of the received item.
     */
    description?: string
  }[]
}

export interface AdminDismissItems {
  /**
   * The damaged items to add to the return.
   */
  items: { 
    /**
     * The ID of the item to add to the return.
     */
    id: string; 
    /**
     * The quantity of the item that is damaged.
     */
    quantity: number; 
    /**
     * A note that is viewed by admins only to
     * describe the damaged item.
     */
    internal_note?: string
  }[]
}

/**
 * @privateRemarks
 * This type doesn't match the validator of the API route,
 * however, it's used by the admin dashboard. We should
 * consider creating separate types for the admin.
 */
export interface AdminUpdateReceiveItems {
  /**
   * The received quantity of the item.
   */
  quantity?: number
  /**
   * A note that is viewed by admins only to
   * describe the received item.
   */
  internal_note?: string
  /**
   * The ID of the return reason to associate with the item.
   */
  reason_id?: string
  /**
   * Custom key-value pairs that can be added to the received item.
   */
  metadata?: Record<string, unknown>
}

/**
 * @privateRemarks
 * This type doesn't match the validator of the API route,
 * however, it's used by the admin dashboard. We should
 * consider creating separate types for the admin.
 */
export interface AdminUpdateDismissItems {
  /**
   * The quantity of the item that is damaged.
   */
  quantity?: number
  /**
   * A note that is viewed by admins only to
   */
  internal_note?: string
  /**
   * The ID of the return reason to associate with the item.
   */
  reason_id?: string
  /**
   * Custom key-value pairs that can be added to the received item.
   */
  metadata?: Record<string, unknown>
}
