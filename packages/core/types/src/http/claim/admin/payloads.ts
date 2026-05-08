/**
 * The reasons for creating a claim.
 */
enum ClaimReason {
  MISSING_ITEM = "missing_item",
  WRONG_ITEM = "wrong_item",
  PRODUCTION_FAILURE = "production_failure",
  OTHER = "other",
}

interface AdminClaimAddItems {
  /**
   * The items to add to the claim.
   */
  items: {
    /**
     * The ID of the item in the order.
     */
    id: string
    /**
     *  The quantity to claim.
     */
    quantity: number
    /**
     * The reason for adding this item to the claim.
     */
    reason?: ClaimReason
    /**
     * The claim item's description.
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
  }[]
}

interface AdminClaimUpdateItem {
  /**
   * The item's claimed quantity.
   */
  quantity?: number
  /**
   * The ID of the associated claim reason.
   */
  reason_id?: string | null
  /**
   * The claim item's description.
   */
  description?: string
  /**
   * An internal note viewed by admin users only.
   */
  internal_note?: string | null
}

interface AdminClaimAddShippingMethod {
  /**
   * The ID of the shipping option to create the method from.
   */
  shipping_option_id: string
  /**
   * A custom amount to use instead of the shipping option's amount.
   */
  custom_amount?: number
  /**
   * The method's description.
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

interface AdminClaimUpdateShippingMethod {
  /**
   * A custom amount to use instead of the shipping option's amount.
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

export interface AdminCreateClaim {
  /**
   * The claim's type. If `refund`, it means the claim's items
   * are returned and the customer is refunded. If `replace`, it
   * means the merchant will send new items in place of the returned items.
   */
  type: "refund" | "replace"
  /**
   * The ID of the order this claim is created for.
   */
  order_id: string
  /**
   * The claim's description.
   */
  description?: string
  /**
   * An internal note viewed by admin users only.
   */
  internal_note?: string
  /**
   * The ID of the associated reason.
   */
  reason_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The details to add new items to a claim.
 */
export interface AdminAddClaimItems extends AdminClaimAddItems {}

/**
 * The details to update a claim item.
 */
export interface AdminUpdateClaimItem
  extends Omit<AdminClaimUpdateItem, "description"> {}

/**
 * The details to add inbound items to a claim.
 */
export interface AdminAddClaimInboundItems extends AdminClaimAddItems {}

/**
 * The details to update a claim inbound item.
 */
export interface AdminUpdateClaimInboundItem extends AdminClaimUpdateItem {}

/**
 * The details to add outbound items to a claim.
 */
export interface AdminAddClaimOutboundItems {
  /**
   * The outbound items to add to the claim.
   */
  items: {
    /**
     * The ID of the product variant.
     */
    variant_id: string
    /**
     * The quantity of the item.
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
     * Key-value pairs of custom data.
     */
    metadata?: Record<string, unknown> | null
  }[]
}

/**
 * The details to update a claim outbound item.
 */
export interface AdminUpdateClaimOutboundItem
  extends Omit<AdminClaimUpdateItem, "description"> {}

/**
 * The details to add inbound shipping to a claim.
 */
export interface AdminClaimAddInboundShipping
  extends AdminClaimAddShippingMethod {}

/**
 * The details to update claim inbound shipping.
 */
export interface AdminClaimUpdateInboundShipping
  extends AdminClaimUpdateShippingMethod {}

/**
 * The details to add outbound shipping to a claim.
 */
export interface AdminClaimAddOutboundShipping
  extends AdminClaimAddShippingMethod {}

/**
 * The details to update claim outbound shipping.
 */
export interface AdminClaimUpdateOutboundShipping
  extends AdminClaimUpdateShippingMethod {}

/**
 * The details to request a claim.
 */
export interface AdminRequestClaim {
  // no_notification?: boolean // TODO: add in the API
}

/**
 * The details to cancel a claim.
 */
export interface AdminCancelClaim {
  /**
   * Whether to send a notification to the customer when the claim is cancelled.
   */
  no_notification?: boolean
}
