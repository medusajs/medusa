import { AdminFulfillmentSetResponse } from "./fulfillment-set"
import { AdminGeoZoneResponse } from "./geo-zone"

export interface AdminServiceZoneResponse {
  id: string
  name: string
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null

  fulfillment_sets: AdminFulfillmentSetResponse[]
  geo_zones: AdminGeoZoneResponse[]
  // TODO: Add type as we add shipping option management
  // shipping_options: ShippingOptionDTO[]
}
