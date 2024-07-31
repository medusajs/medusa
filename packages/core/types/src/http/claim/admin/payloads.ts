enum ClaimReason {
  MISSING_ITEM = "missing_item",
  WRONG_ITEM = "wrong_item",
  PRODUCTION_FAILURE = "production_failure",
  OTHER = "other",
}

interface AdminClaimAddItems {
  items: {
    id: string
    quantity: number
    reason?: ClaimReason
    description?: string
    internal_note?: string
  }[]
}

interface AdminClaimUpdateItem {
  quantity?: number
  reason_id?: ClaimReason
  description?: string
  internal_note?: string
}

interface AdminClaimAddShippingMethod {
  shipping_option_id: string
  custom_price?: number
  description?: string
  internal_note?: string
  metadata?: Record<string, unknown> | null
}

interface AdminClaimUpdateShippingMethod {
  custom_price?: number
  internal_note?: string
  metadata?: Record<string, unknown> | null
}

export interface AdminCreateClaim {
  type: "refund" | "replace"
  order_id: string
  description?: string
  internal_note?: string
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
