import { BaseFilterable } from "../../dal"

export type GeoZoneType = "country" | "province" | "city" | "zip"

export interface GeoZoneDTO {
  id: string
  type: GeoZoneType
  country_code: string
  province_code: string | null
  city: string | null
  postal_expression: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface FilterableGeoZoneProps
  extends BaseFilterable<FilterableGeoZoneProps> {
  id?: string | string[]
  type?: GeoZoneType | GeoZoneType[]
  country_code?: string | string[]
  province_code?: string | string[]
  city?: string | string[]
  // postal_expression?: Record<string, unknown> | Record<string, unknown>[] // TODO: Add support for postal_expression filtering
}
