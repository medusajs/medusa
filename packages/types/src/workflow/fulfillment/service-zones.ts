import {
  CreateCityGeoZoneDTO,
  CreateCountryGeoZoneDTO,
  CreateProvinceGeoZoneDTO,
  CreateZipGeoZoneDTO,
  FilterableServiceZoneProps,
} from "../../fulfillment"

interface CreateServiceZone {
  name: string
  fulfillment_set_id: string
  geo_zones?: (
    | Omit<CreateCountryGeoZoneDTO, "service_zone_id">
    | Omit<CreateProvinceGeoZoneDTO, "service_zone_id">
    | Omit<CreateCityGeoZoneDTO, "service_zone_id">
    | Omit<CreateZipGeoZoneDTO, "service_zone_id">
  )[]
}

export interface CreateServiceZonesWorkflowInput {
  data: CreateServiceZone[]
}

interface UpdateServiceZone {
  name?: string
  geo_zones?: (
    | Omit<CreateCountryGeoZoneDTO, "service_zone_id">
    | Omit<CreateProvinceGeoZoneDTO, "service_zone_id">
    | Omit<CreateCityGeoZoneDTO, "service_zone_id">
    | Omit<CreateZipGeoZoneDTO, "service_zone_id">
    | { id: string }
  )[]
}

export interface UpdateServiceZonesWorkflowInput {
  selector: FilterableServiceZoneProps
  update: UpdateServiceZone
}
