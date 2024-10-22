interface AdminUpsertGeoZone {
  /**
   * The geo zone's type.
   */
  type: string
  /**
   * The geo zone's country code.
   * 
   * @example
   * us
   */
  country_code: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

interface AdminUpsertFulfillmentSetServiceZoneCountry
  extends AdminUpsertGeoZone {
  type: "country"
}

interface AdminUpsertFulfillmentSetServiceZoneProvince
  extends AdminUpsertGeoZone {
  type: "province"
  /**
   * The geo zone's province code.
   */
  province_code: string
}

interface AdminUpsertFulfillmentSetServiceZoneCity extends AdminUpsertGeoZone {
  type: "city"
  /**
   * The geo zone's province code.
   */
  province_code: string
  /**
   * The geo zone's city.
   */
  city: string
}

interface AdminUpsertFulfillmentSetServiceZoneZip extends AdminUpsertGeoZone {
  type: "zip"
  /**
   * The geo zone's province code.
   */
  province_code: string
  /**
   * The geo zone's city.
   */
  city: string
  /**
   * The geo zone's postal expression or ZIP code.
   */
  postal_expression: Record<string, unknown>
}

type AdminUpsertFulfillmentSetServiceZoneGeoZone =
  | AdminUpsertFulfillmentSetServiceZoneCountry
  | AdminUpsertFulfillmentSetServiceZoneProvince
  | AdminUpsertFulfillmentSetServiceZoneCity
  | AdminUpsertFulfillmentSetServiceZoneZip

export interface AdminCreateFulfillmentSetServiceZone {
  /**
   * The service zone's name.
   */
  name: string
  /**
   * The service zone's geo zones to restrict it to
   * specific geographical locations.
   */
  geo_zones: AdminUpsertFulfillmentSetServiceZoneGeoZone[]
}

interface AdminUpdateGeoZone extends AdminUpsertGeoZone {
  /**
   * The ID of the geo zone to update.
   */
  id?: string
}

interface AdminUpdateFulfillmentSetServiceZoneCountry
  extends AdminUpdateGeoZone {
  type: "country"
}

interface AdminUpdateFulfillmentSetServiceZoneProvince
  extends AdminUpdateGeoZone {
  type: "province"
  /**
   * The geo zone's province code.
   */
  province_code: string
}

interface AdminUpdateFulfillmentSetServiceZoneCity extends AdminUpdateGeoZone {
  type: "city"
  /**
   * The geo zone's province code.
   */
  province_code: string
  /**
   * The geo zone's city.
   */
  city: string
}

interface AdminUpdateFulfillmentSetServiceZoneZip extends AdminUpdateGeoZone {
  type: "zip"
  /**
   * The geo zone's province code.
   */
  province_code: string
  /**
   * The geo zone's city.
   */
  city: string
  /**
   * The geo zone's postal expression or ZIP code.
   */
  postal_expression: Record<string, unknown>
}

type AdminUpdateFulfillmentSetServiceZoneGeoZone =
  | AdminUpdateFulfillmentSetServiceZoneCountry
  | AdminUpdateFulfillmentSetServiceZoneProvince
  | AdminUpdateFulfillmentSetServiceZoneCity
  | AdminUpdateFulfillmentSetServiceZoneZip

export interface AdminUpdateFulfillmentSetServiceZone {
  /**
   * The service zone's name.
   */
  name?: string
  /**
   * The service zone's geo zones to restrict it to
   * specific geographical locations. You can update
   * existing ones by their IDs or add new ones.
   */
  geo_zones?: AdminUpdateFulfillmentSetServiceZoneGeoZone[]
}
