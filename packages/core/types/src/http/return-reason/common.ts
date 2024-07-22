export interface BaseReturnReason {
  id: string
  value: string
  label: string
  description?: string | null
  metadata?: Record<string, any> | null
  created_at: string
  updated_at: string
}
