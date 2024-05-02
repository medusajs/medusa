import { GeoZoneType } from "../common"

/**
 * The geo zone to be created.
 */
interface CreateGeoZoneBaseDTO {
  /**
   * The type of the geo zone.
   */
  type: GeoZoneType

  /**
   * The associated service zone's ID.
   */
  service_zone_id: string

  /**
   * The ISO 2 character country code of the geo zone.
   */
  country_code: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, any> | null
}

/**
 * The geo zone to be created of type `country`.
 */
export interface CreateCountryGeoZoneDTO extends CreateGeoZoneBaseDTO {
  /**
   * The type of the geo zone.
   * @defaultValue `"country"`
   */
  type: "country"
}

/**
 * The geo zone to be created of type `province`.
 */
export interface CreateProvinceGeoZoneDTO extends CreateGeoZoneBaseDTO {
  /**
   * The type of the geo zone.
   * @defaultValue `"province"`
   */
  type: "province"

  /**
   * The province code of the geo zone.
   */
  province_code: string
}

/**
 * The geo zone to be created of type `city`.
 */
export interface CreateCityGeoZoneDTO extends CreateGeoZoneBaseDTO {
  /**
   * The type of the geo zone.
   * @defaultValue `"city"`
   */
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

/**
 * The geo zone to be created of type `zip`.
 */
export interface CreateZipGeoZoneDTO extends CreateGeoZoneBaseDTO {
  /**
   * The type of the geo zone.
   * @defaultValue `"zip"`
   */
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
  postal_expression: Record<string, any>
}

/**
 * The geo zone to be created. The value of the `type` attributes allows for passing more attributes.
 */
export type CreateGeoZoneDTO =
  | CreateCountryGeoZoneDTO
  | CreateProvinceGeoZoneDTO
  | CreateCityGeoZoneDTO
  | CreateZipGeoZoneDTO

/**
 * The attributes to update in the geo zone.
 */
export interface UpdateGeoZoneBaseDTO extends Partial<CreateGeoZoneBaseDTO> {
  /**
   * The ID of the geo zone.
   */
  id: string
}

/**
 * The attributes to update in the geo zone of type `country`.
 */
export interface UpdateCountryGeoZoneDTO extends UpdateGeoZoneBaseDTO {
  /**
   * The type of the geo zone.
   * @defaultValue `"country"`
   */
  type: "country"
}

/**
 * The attributes to update in the geo zone of type `province`.
 */
export interface UpdateProvinceGeoZoneDTO extends UpdateGeoZoneBaseDTO {
  /**
   * The type of the geo zone.
   * @defaultValue `"province"`
   */
  type: "province"

  /**
   * The province code of the geo zone.
   */
  province_code: string
}

/**
 * The attributes to update in the geo zone of type `city`.
 */
export interface UpdateCityGeoZoneDTO extends UpdateGeoZoneBaseDTO {
  /**
   * The type of the geo zone.
   * @defaultValue `"city"`
   */
  type: "city"

  /**
   * The province code of the geo zone.
   */
  province_code?: string

  /**
   * The city of the geo zone.
   */
  city?: string
}

/**
 * The attributes to update in the geo zone of type `zip`.
 */
export interface UpdateZipGeoZoneDTO extends UpdateGeoZoneBaseDTO {
  /**
   * The type of the geo zone.
   * @defaultValue `"zip"`
   */
  type: "zip"

  /**
   * The province code of the geo zone.
   */
  province_code?: string

  /**
   * The city of the geo zone.
   */
  city?: string

  /**
   * The postal expression of the geo zone.
   */
  postal_expression?: Record<string, any>
}

/**
 * The attributes to update in the geo zone. The value of the `type` attributes allows for passing more attributes.
 */
export type UpdateGeoZoneDTO =
  | UpdateCountryGeoZoneDTO
  | UpdateProvinceGeoZoneDTO
  | UpdateCityGeoZoneDTO
  | UpdateZipGeoZoneDTO
