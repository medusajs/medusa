/**
 * @experimental
 */
export interface AdminShippingProfileResponse {
  id: string
  name: string
  type: string
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
