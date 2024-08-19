export interface AdminInitiateOrderEditRequest {
  order_id: string
  description?: string
  internal_note?: string
  metadata?: Record<string, unknown>
}
