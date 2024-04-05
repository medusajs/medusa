import { AdminGeoZoneResponse } from "./geo-zone"

/**
 * @experimental
 */
export interface AdminServiceZoneResponse {
  id: string
  name: string
  metadata: Record<string, unknown> | null
  geo_zones: AdminGeoZoneResponse[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
