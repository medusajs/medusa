import { GeoZoneType } from "../common"

interface CreateGeoZoneBaseDTO {
  type: GeoZoneType
  service_zone_id: string
  country_code: string
  metadata?: Record<string, any> | null
}

interface CreateCountryGeoZoneDTO extends CreateGeoZoneBaseDTO {
  type: "country"
}

interface CreateProvinceGeoZoneDTO extends CreateGeoZoneBaseDTO {
  type: "province"
  province_code: string
}

interface CreateCityGeoZoneDTO extends CreateGeoZoneBaseDTO {
  type: "city"
  city: string
}

interface CreateZipGeoZoneDTO extends CreateGeoZoneBaseDTO {
  type: "zip"
  postal_expression: Record<string, any>
}

export type CreateGeoZoneDTO =
  | CreateCountryGeoZoneDTO
  | CreateProvinceGeoZoneDTO
  | CreateCityGeoZoneDTO
  | CreateZipGeoZoneDTO

interface UpdateGeoZoneBaseDTO extends Partial<CreateGeoZoneBaseDTO> {
  id: string
}

interface UpdateCountryGeoZoneDTO extends UpdateGeoZoneBaseDTO {
  type: "country"
}

interface UpdateProvinceGeoZoneDTO extends UpdateGeoZoneBaseDTO {
  type: "province"
  province_code: string
}

interface UpdateCityGeoZoneDTO extends UpdateGeoZoneBaseDTO {
  type: "city"
  city: string
}

interface UpdateZipGeoZoneDTO extends UpdateGeoZoneBaseDTO {
  type: "zip"
  postal_expression: Record<string, any>
}

export type UpdateGeoZoneDTO =
  | UpdateCountryGeoZoneDTO
  | UpdateProvinceGeoZoneDTO
  | UpdateCityGeoZoneDTO
  | UpdateZipGeoZoneDTO
