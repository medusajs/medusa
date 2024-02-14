import { CreateGeoZoneDTO } from "./geo-zone"

export interface CreateServiceZoneDTO {
  name: string
  fulfillment_set_id: string
  geo_zones?: Omit<CreateGeoZoneDTO, "service_zone_id">[]
}

export interface UpdateServiceZoneDTO {
  id: string
  name?: string
  geo_zones?: (Omit<CreateGeoZoneDTO, "service_zone_id"> | { id: string })[]
}
