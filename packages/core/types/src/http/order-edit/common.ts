export interface BaseOrderEditItem {
  id: string
  order_id: string
  item_id: string
  quantity: number
  metadata?: Record<string, unknown>
  created_at: string | null
  updated_at: string | null
}
