export interface AdminAddExchangeOutboundItems {
  /**
   * The items to add to the exchange.
   */
  items: {
    /**
     * The ID of the variant to add.
     */
    variant_id: string
    /**
     * The item's quantity.
     */
    quantity: number
    /**
     * The item's unit price.
     */
    unit_price?: number
    /**
     * An internal note viewed by admin users only.
     */
    internal_note?: string
    /**
     * Whether to allow backorder for the item.
     */
    allow_backorder?: boolean
    /**
     * Key-value pairs of custom data.
     */
    metadata?: Record<string, unknown>
  }[]
}

interface AdminExchangeUpdateItem {
  /**
   * The item's quantity.
   */
  quantity?: number
  /**
   * The ID of the associated return reason.
   */
  reason_id?: string | null
  /**
   * The item's description.
   */
  description?: string
  /**
   * An internal note viewed by admin users only.
   */
  internal_note?: string | null
}

interface AdminExchangeAddShippingMethod {
  /**
   * The ID of the shipping option the method is created from.
   */
  shipping_option_id: string
  /**
   * A custom amount for the shipping method. If not specified,
   * the shipping option's amount is used.
   */
  custom_amount?: number
  /**
   * The shipping method's description.
   */
  description?: string
  /**
   * An internal note viewed by admin users only.
   */
  internal_note?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

interface AdminExchangeUpdateShippingMethod {
  /**
   * A custom amount for the shipping method.
   */
  custom_amount?: number | null
  /**
   * An internal note viewed by admin users only.
   */
  internal_note?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminCreateExchange {
  /**
   * The ID of the order the exchange is created for.
   */
  order_id: string
  /**
   * The exchange's description.
   */
  description?: string
  /**
   * An internal note viewed by admin users only.
   */
  internal_note?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminAddExchangeInboundItems {
  /**
   * The ID of the location the items are returned to.
   */
  location_id?: string
  /**
   * The items to add to the exchange.
   */
  items: {
    /**
     * The ID of the order item returned.
     */
    id: string
    /**
     * The item's quantity.
     */
    quantity: number
    /**
     * The description of why the item is being returned.
     */
    description?: string
    /**
     * An internal note viewed by admin users only.
     */
    internal_note?: string
    /**
     * The ID of the associated return reason.
     */
    reason_id?: string
    /**
     * Key-value pairs of custom data.
     */
    metadata?: Record<string, unknown>
  }[]
}
export interface AdminUpdateExchangeInboundItem extends AdminExchangeUpdateItem {}

export interface AdminUpdateExchangeOutboundItem extends Omit<
  AdminExchangeUpdateItem,
  "reason_id" | "description"
> {}

export interface AdminExchangeAddInboundShipping extends AdminExchangeAddShippingMethod {}
export interface AdminExchangeUpdateInboundShipping extends AdminExchangeUpdateShippingMethod {}

export interface AdminExchangeAddOutboundShipping extends AdminExchangeAddShippingMethod {}
export interface AdminExchangeUpdateOutboundShipping extends AdminExchangeUpdateShippingMethod {}

export interface AdminRequestExchange {
  /**
   * Whether to send the customer a notification.
   */
  no_notification?: boolean
}

export interface AdminCancelExchange {
  no_notification?: boolean
}
