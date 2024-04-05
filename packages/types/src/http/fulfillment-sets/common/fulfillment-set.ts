import { AdminServiceZoneResponse } from "./service-zone"

export interface AdminFulfillmentSetResponse {
  id: string
  name: string
  type: string
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null

  service_zones: AdminServiceZoneResponse[]
}
