export interface AdminShippingProfile {
  id: string
  name: string
  type: string
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}
