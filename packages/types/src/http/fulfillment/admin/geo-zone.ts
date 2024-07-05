import { GeoZoneType } from "../../../fulfillment"

/**
 * @experimental
 */
export interface AdminGeoZoneResponse {
  id: string
  type: GeoZoneType
  country_code: string
  province_code: string | null
  city: string | null
  postal_expression: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
