import { GeoZoneType } from "../../../fulfillment"
import { AdminShippingOption } from "../../shipping-option"
import { AdminStockLocation } from "../../stock-locations"

export interface AdminGeoZone {
  /**
   * The geo zone's ID.
   */
  id: string
  /**
   * The geo zone's type.
   */
  type: GeoZoneType
  /**
   * The geo zone's country code.
   * 
   * @example
   * us
   */
  country_code: string
  /**
   * The geo zone's province code.
   */
  province_code: string | null
  /**
   * The geo zone's city.
   */
  city: string | null
  /**
   * The geo zone's postal expression.
   */
  postal_expression: Record<string, unknown> | null
  /**
   * The date the geo zone was created.
   */
  created_at: string
  /**
   * The date the geo zone was updated.
   */
  updated_at: string
  /**
   * The date the geo zone was deleted.
   */
  deleted_at: string | null
}

export interface AdminServiceZone {
  /**
   * The service zone's ID.
   */
  id: string
  /**
   * The service zone's name.
   */
  name: string
  /**
   * The ID of the fulfillment set this service zone belongs to.
   */
  fulfillment_set_id: string
  /**
   * The fulfillment set this service zone belongs to.
   */
  fulfillment_set: AdminFulfillmentSet
  /**
   * The service zone's geo zones.
   */
  geo_zones: AdminGeoZone[]
  /**
   * The shipping options that can be used in this service zone.
   */
  shipping_options: AdminShippingOption[]
  /**
   * The date the service zone is created.
   */
  created_at: string
  /**
   * The date the service zone is updated.
   */
  updated_at: string
  /**
   * The date the service zone is deleted.
   */
  deleted_at: string | null
}

export interface AdminFulfillmentSet {
  /**
   * The fulfillment set's ID.
   */
  id: string
  /**
   * The fulfillment set's name.
   */
  name: string
  /**
   * The fulfillment set's type.
   * 
   * @example
   * delivery
   */
  type: string
  /**
   * The stock location associated with this fulfillment set.
   */
  location: AdminStockLocation
  /**
   * The fulfillment set's service zones.
   */
  service_zones: AdminServiceZone[]
  /**
   * The date the fulfillment set is created.
   */
  created_at: string
  /**
   * The date the fulfillment set is updated.
   */
  updated_at: string
  /**
   * The date the fulfillment set is deleted.
   */
  deleted_at: string | null
}
