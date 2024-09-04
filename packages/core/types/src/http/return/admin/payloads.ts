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
  internal_note?: string | null
  reason_id?: string | null
}

export interface AdminAddReturnShipping {
  shipping_option_id: string
  custom_amount?: number
  description?: string
  internal_note?: string
  metadata?: Record<string, unknown>
}

export interface AdminUpdateReturnShipping {
  custom_amount?: number
  internal_note?: string
  metadata?: Record<string, unknown>
}

export interface AdminConfirmReturnRequest {
  no_notification?: boolean
}

export interface AdminUpdateReturnRequest {
  location_id?: string | null
  no_notification?: boolean
  metadata?: Record<string, unknown> | null
}

export interface AdminConfirmReceiveReturn {
  no_notification?: boolean
}

export interface AdminInitiateReceiveReturn {
  internal_note?: string
  description?: string
  metadata?: Record<string, unknown>
}

export interface AdminReceiveItems {
  items: { id: string; quantity: number; internal_note?: string }[]
}

export interface AdminDismissItems {
  items: { id: string; quantity: number; internal_note?: string }[]
}

export interface AdminUpdateReceiveItems {
  quantity?: number
  internal_note?: string
  reason_id?: string
  metadata?: Record<string, unknown>
}

export interface AdminUpdateDismissItems {
  quantity?: number
  internal_note?: string
  reason_id?: string
  metadata?: Record<string, unknown>
}
