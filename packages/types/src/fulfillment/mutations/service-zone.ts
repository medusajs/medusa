import {
  CreateCityGeoZoneDTO,
  CreateCountryGeoZoneDTO,
  CreateProvinceGeoZoneDTO,
  CreateZipGeoZoneDTO,
} from "./geo-zone"

/**
 * The service zone to be created.
 */
export interface CreateServiceZoneDTO {
  /**
   * The name of the service zone.
   */
  name: string

  /**
   * The associated fulfillment set's ID.
   */
  fulfillment_set_id: string

  /**
   * The geo zones associated with the service zone.
   */
  geo_zones?: (
    | Omit<CreateCountryGeoZoneDTO, "service_zone_id">
    | Omit<CreateProvinceGeoZoneDTO, "service_zone_id">
    | Omit<CreateCityGeoZoneDTO, "service_zone_id">
    | Omit<CreateZipGeoZoneDTO, "service_zone_id">
  )[]
}

/**
 * The attributes to update in the service zone.
 */
export interface UpdateServiceZoneDTO {
  /**
   * The ID of the service zone.
   */
  id?: string

  /**
   * The name of the service zone.
   */
  name?: string

  /**
   * The geo zones associated with the service zone.
   */
  geo_zones?: (
    | Omit<CreateCountryGeoZoneDTO, "service_zone_id">
    | Omit<CreateProvinceGeoZoneDTO, "service_zone_id">
    | Omit<CreateCityGeoZoneDTO, "service_zone_id">
    | Omit<CreateZipGeoZoneDTO, "service_zone_id">
    | {
        /**
         * The ID of the geo zone.
         */
        id: string
      }
  )[]
}

/**
 * A service zone to be created or updated.
 */
export interface UpsertServiceZoneDTO extends UpdateServiceZoneDTO {}
