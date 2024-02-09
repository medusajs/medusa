import { CreateGeoZoneDTO, UpdateGeoZoneDTO } from "./geo-zone"

export interface CreateServiceZoneDTO {
  fulfillment_set_id: string
  name: string
  geo_zones: (CreateGeoZoneDTO | UpdateGeoZoneDTO)[]
}

export interface UpdateServiceZoneDTO extends Partial<CreateServiceZoneDTO> {
  id: string
}
