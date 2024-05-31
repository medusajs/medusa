import { GeoZoneType } from "../../fulfillment"
import { BaseSoftDeletableHttpEntity } from "../base"
import { AdminShippingOption } from "../shipping-option"

export interface AdminGeoZone extends BaseSoftDeletableHttpEntity {
  /**
   * The type of the geo zone.
   */
  type: GeoZoneType
  /**
   * The country code of the geo zone.
   */
  country_code: string
  /**
   * The province code of the geo zone.
   */
  province_code: string | null
  /**
   * The city of the geo zone.
   */
  city: string | null
  /**
   * The postal expression of the geo zone.
   */
  postal_expression: Record<string, unknown> | null
}

export interface AdminServiceZone extends BaseSoftDeletableHttpEntity {
  /**
   * The name of the service zone.
   */
  name: string
  /**
   * The ID of the fulfillment set associated with the service zone.
   */
  fulfillment_set_id: string
  /**
   * The geo zones associated with the service zone.
   */
  geo_zones: AdminGeoZone[]
  /**
   * The shipping options associated with the service zone.
   */
  shipping_options: AdminShippingOption[]
}

export interface AdminServiceZoneResponse {
  service_zone: AdminServiceZone
}

export interface AdminFulfillmentSet extends BaseSoftDeletableHttpEntity {
  /**
   * The name of the fulfillment set.
   */
  name: string
  /**
   * The type of the fulfillment set.
   */
  type: string
  /**
   * The service zones associated with the fulfillment set.
   */
  service_zones: AdminServiceZone[]
}

export interface AdminFulfillmentSetResponse {
  fulfillment_set: AdminFulfillmentSet
}

interface UpsertGeoZone {
  /**
   * The type of the geo zone.
   */
  type: string
  /**
   * The country code of the geo zone.
   */
  country_code: string
  /**
   * Metadata associated with the geo zone.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpsertFulfillmentSetServiceZoneCountry
  extends UpsertGeoZone {
  type: "country"
}

export interface AdminUpsertFulfillmentSetServiceZoneProvince
  extends UpsertGeoZone {
  type: "province"
  /**
   * The province code of the geo zone.
   */
  province_code: string
}

export interface AdminUpsertFulfillmentSetServiceZoneCity
  extends UpsertGeoZone {
  type: "city"
  /**
   * The province code of the geo zone.
   */
  province_code: string
  /**
   * The city of the geo zone.
   */
  city: string
}

export interface AdminUpsertFulfillmentSetServiceZoneZip extends UpsertGeoZone {
  type: "zip"
  /**
   * The province code of the geo zone.
   */
  province_code: string
  /**
   * The city of the geo zone.
   */
  city: string
  /**
   * The postal expression of the geo zone.
   */
  postal_expression: Record<string, unknown>
}

export type AdminUpsertFulfillmentSetServiceZoneGeoZone =
  | AdminUpsertFulfillmentSetServiceZoneCountry
  | AdminUpsertFulfillmentSetServiceZoneProvince
  | AdminUpsertFulfillmentSetServiceZoneCity
  | AdminUpsertFulfillmentSetServiceZoneZip

interface UpdateGeoZone extends UpsertGeoZone {
  /**
   * The ID of the geo zone.
   */
  id?: string
}

export interface AdminUpdateFulfillmentSetServiceZoneCountry
  extends UpdateGeoZone {
  type: "country"
}

export interface AdminUpdateFulfillmentSetServiceZoneProvince
  extends UpdateGeoZone {
  type: "province"
  /**
   * The province code of the geo zone.
   */
  province_code: string
}

export interface AdminUpdateFulfillmentSetServiceZoneCity
  extends UpdateGeoZone {
  type: "city"
  province_code: string
  city: string
}

export interface AdminUpdateFulfillmentSetServiceZoneZip extends UpdateGeoZone {
  type: "zip"
  province_code: string
  city: string
  postal_expression: Record<string, unknown>
}

export type AdminUpdateFulfillmentSetServiceZoneGeoZone =
  | AdminUpdateFulfillmentSetServiceZoneCountry
  | AdminUpdateFulfillmentSetServiceZoneProvince
  | AdminUpdateFulfillmentSetServiceZoneCity
  | AdminUpdateFulfillmentSetServiceZoneZip

export interface AdminCreateFulfillmentSetServiceZone {
  /**
   * The name of the service zone.
   */
  name: string
  /**
   * The geo zones to associate with the service zone.
   */
  geo_zones: AdminUpsertFulfillmentSetServiceZoneGeoZone[]
}

export interface AdminUpdateFulfillmentSetServiceZone {
  /**
   * The name of the service zone.
   */
  name?: string
  /**
   * The geo zones to associate with the service zone.
   */
  geo_zones?: AdminUpdateFulfillmentSetServiceZoneGeoZone[]
}
