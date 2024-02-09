import { FulfillmentSetDTO } from "./fulfillment-set"
import { FilterableGeoZoneProps, GeoZoneDTO } from "./geo-zone"
import { ShippingOptionDTO } from "./shipping-option"
import { BaseFilterable } from "../../dal"

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

export interface FilterableServiceZoneProps
  extends BaseFilterable<FilterableServiceZoneProps> {
  id?: string | string[]
  name?: string | string[]
  geo_zones?: FilterableGeoZoneProps
  shipping_options?: any // TODO
}
