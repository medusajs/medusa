import { FulfillmentSetResponse } from "./fulfillment-set"
import { AdminGeoZoneResponse } from "./geo-zone"

/**
 * @experimental
 */
export interface AdminServiceZoneResponse {
  service_zone: ServiceZoneResponse
}

/**
 * @experimental
 */
export interface AdminServiceZoneDeleteResponse {
  id: string
  object: "service-zone"
  deleted: boolean
  parent: FulfillmentSetResponse
}

/**
 * @experimental
 */
export interface ServiceZoneResponse {
  id: string
  name: string
  metadata: Record<string, unknown> | null
  geo_zones: AdminGeoZoneResponse[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
