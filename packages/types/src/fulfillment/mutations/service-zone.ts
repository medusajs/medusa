import { CreateGeoZoneDTO } from "./geo-zone"

export interface CreateServiceZoneDTO {
  name: string
  geo_zones?: (CreateGeoZoneDTO | { id: string })[]
}

export interface UpdateServiceZoneDTO extends Partial<CreateServiceZoneDTO> {
  id: string
}
