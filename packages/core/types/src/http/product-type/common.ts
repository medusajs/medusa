export interface BaseProductType {
  id: string
  value: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
  metadata?: Record<string, unknown> | null
}
