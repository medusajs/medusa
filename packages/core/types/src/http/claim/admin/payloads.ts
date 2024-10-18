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
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminAddClaimItems extends AdminClaimAddItems {}
export interface AdminUpdateClaimItem extends AdminClaimUpdateItem {}

export interface AdminAddClaimInboundItems extends AdminClaimAddItems {}
export interface AdminUpdateClaimInboundItem extends AdminClaimUpdateItem {}

export interface AdminAddClaimOutboundItems extends AdminClaimAddItems {}
export interface AdminUpdateClaimOutboundItem extends AdminClaimUpdateItem {}

export interface AdminClaimAddInboundShipping
  extends AdminClaimAddShippingMethod {}
export interface AdminClaimUpdateInboundShipping
  extends AdminClaimUpdateShippingMethod {}

export interface AdminClaimAddOutboundShipping
  extends AdminClaimAddShippingMethod {}
export interface AdminClaimUpdateOutboundShipping
  extends AdminClaimUpdateShippingMethod {}

export interface AdminRequestClaim {
  // no_notification?: boolean // TODO: add in the API
}

export interface AdminCancelClaim {
  no_notification?: boolean
}
