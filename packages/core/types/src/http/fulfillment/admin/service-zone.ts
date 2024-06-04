import { FulfillmentSetResponse } from "./fulfillment-set"
import { AdminGeoZoneResponse } from "./geo-zone"

export interface AdminServiceZoneResponse {
  service_zone: ServiceZoneResponse
}

export interface AdminServiceZoneDeleteResponse {
  id: string
  object: "service-zone"
  deleted: boolean
  parent: FulfillmentSetResponse
}

export interface ServiceZoneResponse {
  id: string
  name: string
  metadata: Record<string, unknown> | null
  geo_zones: AdminGeoZoneResponse[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
