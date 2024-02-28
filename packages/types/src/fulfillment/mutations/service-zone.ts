import {
  CreateCityGeoZoneDTO,
  CreateCountryGeoZoneDTO,
  CreateProvinceGeoZoneDTO,
  CreateZipGeoZoneDTO,
} from "./geo-zone"

export interface CreateServiceZoneDTO {
  name: string
  fulfillment_set_id: string
  geo_zones?: (
    | Omit<CreateCountryGeoZoneDTO, "service_zone_id">
    | Omit<CreateProvinceGeoZoneDTO, "service_zone_id">
    | Omit<CreateCityGeoZoneDTO, "service_zone_id">
    | Omit<CreateZipGeoZoneDTO, "service_zone_id">
  )[]
}

export interface UpdateServiceZoneDTO {
  id: string
  name?: string
  geo_zones?: (
    | Omit<CreateCountryGeoZoneDTO, "service_zone_id">
    | Omit<CreateProvinceGeoZoneDTO, "service_zone_id">
    | Omit<CreateCityGeoZoneDTO, "service_zone_id">
    | Omit<CreateZipGeoZoneDTO, "service_zone_id">
    | { id: string }
  )[]
}
