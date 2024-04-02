import { GeoZoneType } from "../common"

interface CreateGeoZoneBaseDTO {
  type: GeoZoneType
  service_zone_id: string
  country_code: string
  metadata?: Record<string, any> | null
}

export interface CreateCountryGeoZoneDTO extends CreateGeoZoneBaseDTO {
  type: "country"
}

export interface CreateProvinceGeoZoneDTO extends CreateGeoZoneBaseDTO {
  type: "province"
  province_code: string
}

export interface CreateCityGeoZoneDTO extends CreateGeoZoneBaseDTO {
  type: "city"
  province_code: string
  city: string
}

export interface CreateZipGeoZoneDTO extends CreateGeoZoneBaseDTO {
  type: "zip"
  province_code: string
  city: string
  postal_expression: Record<string, any>
}

export type CreateGeoZoneDTO =
  | CreateCountryGeoZoneDTO
  | CreateProvinceGeoZoneDTO
  | CreateCityGeoZoneDTO
  | CreateZipGeoZoneDTO

export interface UpdateGeoZoneBaseDTO extends Partial<CreateGeoZoneBaseDTO> {
  id: string
}

export interface UpdateCountryGeoZoneDTO extends UpdateGeoZoneBaseDTO {
  type: "country"
}

export interface UpdateProvinceGeoZoneDTO extends UpdateGeoZoneBaseDTO {
  type: "province"
  province_code: string
}

export interface UpdateCityGeoZoneDTO extends UpdateGeoZoneBaseDTO {
  type: "city"
  province_code?: string
  city?: string
}

export interface UpdateZipGeoZoneDTO extends UpdateGeoZoneBaseDTO {
  type: "zip"
  province_code?: string
  city?: string
  postal_expression?: Record<string, any>
}

export type UpdateGeoZoneDTO =
  | UpdateCountryGeoZoneDTO
  | UpdateProvinceGeoZoneDTO
  | UpdateCityGeoZoneDTO
  | UpdateZipGeoZoneDTO
