import { FulfillmentSetDTO } from "./fulfillment-set"
import { GeoZoneDTO } from "./geo-zone"

export interface ServiceZoneDTO {
  id: string
  name: string
  metadata: Record<string, unknown> | null
  fulfillment_sets: FulfillmentSetDTO[]
  geo_zones: GeoZoneDTO[]
  shipping_options: ShippingOptionDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
