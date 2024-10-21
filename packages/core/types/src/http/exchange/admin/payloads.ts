enum ExchangeReason {
  MISSING_ITEM = "missing_item",
  WRONG_ITEM = "wrong_item",
  PRODUCTION_FAILURE = "production_failure",
  OTHER = "other",
}

interface AdminExchangeAddItems {
  items: {
    id: string
    quantity: number
    reason?: ExchangeReason
    description?: string
    internal_note?: string
  }[]
}

interface AdminExchangeUpdateItem {
  quantity?: number
  reason_id?: string | null
  description?: string
  internal_note?: string | null
}

interface AdminExchangeAddShippingMethod {
  shipping_option_id: string
  custom_amount?: number
  description?: string
  internal_note?: string
  metadata?: Record<string, unknown> | null
}

interface AdminExchangeUpdateShippingMethod {
  custom_amount?: number | null
  internal_note?: string
  metadata?: Record<string, unknown> | null
}

export interface AdminCreateExchange {
  type: "refund" | "replace"
  order_id: string
  description?: string
  internal_note?: string
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
  no_notification?: boolean
}

export interface AdminCancelExchange {
  no_notification?: boolean
}
