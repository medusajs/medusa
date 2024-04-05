import { AdminServiceZoneResponse } from "./service-zone"

/**
 * @experimental
 */
export interface AdminFulfillmentSetResponse {
  id: string
  name: string
  type: string
  metadata: Record<string, unknown> | null
  service_zones: AdminServiceZoneResponse[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
