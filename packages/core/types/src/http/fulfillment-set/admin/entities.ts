import { GeoZoneType } from "../../../fulfillment"

export interface AdminGeoZone {
  id: string
  type: GeoZoneType
  country_code: string
  province_code: string | null
  city: string | null
  postal_expression: Record<string, unknown> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AdminServiceZone {
  id: string
  fulfillment_set_id: string
  geo_zones: AdminGeoZone[]
  shipping_options: any[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AdminFulfillmentSet {
  id: string
  name: string
  type: string
  service_zones: AdminServiceZone[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}
