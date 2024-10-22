enum ExchangeReason {
  MISSING_ITEM = "missing_item",
  WRONG_ITEM = "wrong_item",
  PRODUCTION_FAILURE = "production_failure",
  OTHER = "other",
}

interface AdminExchangeAddItems {
  /**
   * The items to add to the exchange.
   */
  items: {
    /**
     * If you're adding an inbound item, this is the ID of the order item returned.
     * If you're adding an outbound item, this is the ID of the variant to add.
     */
    id: string
    /**
     * The item's quantity.
     */
    quantity: number
    /**
     * The reason the item is being returned / sent to the customer.
     */
    reason?: ExchangeReason
    /**
     * The item's description.
     */
    description?: string
    /**
     * An internal note viewed by admin users only.
     */
    internal_note?: string
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

export interface AdminAddExchangeInboundItems extends AdminExchangeAddItems {}
export interface AdminUpdateExchangeInboundItem
  extends AdminExchangeUpdateItem {}

export interface AdminAddExchangeOutboundItems extends AdminExchangeAddItems {}
export interface AdminUpdateExchangeOutboundItem
  extends AdminExchangeUpdateItem {}

export interface AdminExchangeAddInboundShipping
  extends AdminExchangeAddShippingMethod {}
export interface AdminExchangeUpdateInboundShipping
  extends AdminExchangeUpdateShippingMethod {}

export interface AdminExchangeAddOutboundShipping
  extends AdminExchangeAddShippingMethod {}
export interface AdminExchangeUpdateOutboundShipping
  extends AdminExchangeUpdateShippingMethod {}

export interface AdminRequestExchange {
  /**
   * Whether to send the customer a notification.
   */
  no_notification?: boolean
}

export interface AdminCancelExchange {
  no_notification?: boolean
}
