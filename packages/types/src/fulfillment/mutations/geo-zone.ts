import { GeoZoneType } from "../common"

export interface CreateGeoZoneDTO {
  type?: GeoZoneType
  country_code: string
  province_code?: string
  city?: string
  postal_expression?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
}

export interface UpdateGeoZoneDTO extends Partial<CreateGeoZoneDTO> {
  id: string
}
