import { CreateGeoZoneDTO, UpdateGeoZoneDTO } from "./geo-zone"

export interface CreateServiceZoneDTO {
  fulfillment_set_id: string
  name: string
  geo_zones: (
    | Omit<CreateGeoZoneDTO, "service_zone_id">
    | Omit<UpdateGeoZoneDTO, "service_zone_id">
  )[]
}

export interface UpdateServiceZoneDTO extends Partial<CreateServiceZoneDTO> {
  id: string
}
