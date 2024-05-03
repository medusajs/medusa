import { BaseFilterable } from "../../dal"

/**
 * The type of the geo zone.
 */
export type GeoZoneType = "country" | "province" | "city" | "zip"

/**
 * The geo zone details.
 */
export interface GeoZoneDTO {
  /**
   * The ID of the geo zone.
   */
  id: string

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

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The creation date of the geo zone.
   */
  created_at: Date

  /**
   * The update date of the geo zone.
   */
  updated_at: Date

  /**
   * The deletion date of the geo zone.
   */
  deleted_at: Date | null
}

/**
 * The filters to apply on the retrieved geo zones.
 */
export interface FilterableGeoZoneProps
  extends BaseFilterable<FilterableGeoZoneProps> {
  /**
   * The IDs to filter the geo zones by.
   */
  id?: string | string[]

  /**
   * Filter the geo zones by their type.
   */
  type?: GeoZoneType | GeoZoneType[]

  /**
   * Filter the geo zones by their country code.
   */
  country_code?: string | string[]

  /**
   * Filter the geo zones by their province code.
   */
  province_code?: string | string[]

  /**
   * Filter the geo zones by their city.
   */
  city?: string | string[]

  // TODO add support for postal_expression filtering
}
