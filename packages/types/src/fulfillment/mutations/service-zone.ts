import { CreateGeoZoneDTO } from "./geo-zone"

export interface CreateServiceZoneDTO {
  name: string
  fulfillment_set_id: string
  geo_zones?: (Omit<CreateGeoZoneDTO, "service_zone_id"> & {
    service_zone_id?: string
  })[]
}

export interface UpdateServiceZoneDTO extends Partial<CreateServiceZoneDTO> {
  id: string
}
