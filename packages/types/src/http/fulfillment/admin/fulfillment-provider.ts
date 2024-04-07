/**
 * @experimental
 */
export interface AdminFulfillmentProviderResponse {
  id: string
  name: string
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
