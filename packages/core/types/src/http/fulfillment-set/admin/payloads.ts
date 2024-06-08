interface AdminUpsertGeoZone {
  type: string
  country_code: string
  metadata?: Record<string, unknown> | null
}

interface AdminUpsertFulfillmentSetServiceZoneCountry
  extends AdminUpsertGeoZone {
  type: "country"
}

interface AdminUpsertFulfillmentSetServiceZoneProvince
  extends AdminUpsertGeoZone {
  type: "province"
  province_code: string
}

interface AdminUpsertFulfillmentSetServiceZoneCity extends AdminUpsertGeoZone {
  type: "city"
  province_code: string
  city: string
}

interface AdminUpsertFulfillmentSetServiceZoneZip extends AdminUpsertGeoZone {
  type: "zip"
  province_code: string
  city: string
  postal_expression: Record<string, unknown>
}

type AdminUpsertFulfillmentSetServiceZoneGeoZone =
  | AdminUpsertFulfillmentSetServiceZoneCountry
  | AdminUpsertFulfillmentSetServiceZoneProvince
  | AdminUpsertFulfillmentSetServiceZoneCity
  | AdminUpsertFulfillmentSetServiceZoneZip

export interface AdminCreateFulfillmentSetServiceZone {
  name: string
  geo_zones: AdminUpsertFulfillmentSetServiceZoneGeoZone[]
}

interface AdminUpdateGeoZone extends AdminUpsertGeoZone {
  id?: string
}

interface AdminUpdateFulfillmentSetServiceZoneCountry
  extends AdminUpdateGeoZone {
  type: "country"
}

interface AdminUpdateFulfillmentSetServiceZoneProvince
  extends AdminUpdateGeoZone {
  type: "province"
  province_code: string
}

interface AdminUpdateFulfillmentSetServiceZoneCity extends AdminUpdateGeoZone {
  type: "city"
  province_code: string
  city: string
}

interface AdminUpdateFulfillmentSetServiceZoneZip extends AdminUpdateGeoZone {
  type: "zip"
  province_code: string
  city: string
  postal_expression: Record<string, unknown>
}

type AdminUpdateFulfillmentSetServiceZoneGeoZone =
  | AdminUpdateFulfillmentSetServiceZoneCountry
  | AdminUpdateFulfillmentSetServiceZoneProvince
  | AdminUpdateFulfillmentSetServiceZoneCity
  | AdminUpdateFulfillmentSetServiceZoneZip

export interface AdminUpdateFulfillmentSetServiceZone {
  name?: string
  geo_zones?: AdminUpdateFulfillmentSetServiceZoneGeoZone[]
}
