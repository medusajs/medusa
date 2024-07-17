export interface BaseReturnItem {
  id: string
  quantity: number
  received_quantity: number
  reason_id?: string
  note?: string
  item_id: string
  return_id: string
  metadata?: Record<string, unknown>
}

export interface AdminReturn {
  id: string
  order_id: string
  status?: string
  exchange_id?: string
  claim_id?: string
  order_version: number
  display_id: number
  no_notification?: boolean
  refund_amount?: number
  items: BaseReturnItem[]
}

export interface AdminReturnResponse {
  return: AdminReturn
}

export interface AdminInitiateReturnRequest {
  order_id: string
  location_id?: string
  description?: string
  internal_note?: string
  no_notification?: boolean
  metadata?: Record<string, unknown>
}

export interface AdminAddReturnItem {
  id: string
  quantity: number
  description?: string
  internal_note?: string
  metadata?: Record<string, unknown>
}

export interface AdminAddReturnItems {
  items: AdminAddReturnItem[]
}

export interface AdminUpdateReturnItems {
  quantity?: number
  internal_note?: string
}

export interface AdminAddReturnShipping {
  shipping_option_id: string
  custom_price?: number
  description?: string
  internal_note?: string
  metadata?: Record<string, unknown>
}
export interface AdminConfirmReturnRequest {
  no_notification?: boolean
}
