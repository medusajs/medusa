export interface AdminFulfillmentProvider {
  id: string
  name: string
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}
