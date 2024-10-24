export interface AdminCreateOrderFulfillment {
  /**
   * The items to add to the fulfillment.
   */
  items: {
    /**
     * The order item's ID.
     */ 
    id: string; 
    /**
     * The quantity to fulfill.
     */
    quantity: number
  }[]
  /**
   * The ID of the stock location
   * to fulfill the items from.
   */
  location_id?: string
  /**
   * Whether to notify the customer about this change.
   */
  no_notification?: boolean
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, any>
}

export interface AdminCreateOrderShipment {
  /**
   * The fulfillment items to create a shipment for.
   */
  items: {
    /**
     * The item's ID.
     */ 
    id: string; 
    /**
     * The quantity to ship.
     */
    quantity: number
  }[]
  /**
   * The shipment's labels.
   */
  labels?: {
    /**
     * The label's tracking number.
     */
    tracking_number: string
    /**
     * The label's tracking URL.
     */
    tracking_url: string
    /**
     * The label's URL.
     */
    label_url: string
  }[]
  /**
   * Whether to notify the customer about this change.
   */
  no_notification?: boolean
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, any>
}

export interface AdminCancelOrderFulfillment {
  /**
   * Whether to notify the customer about this change.
   */
  no_notification?: boolean
}

export interface AdminMarkOrderFulfillmentAsDelivered {}
