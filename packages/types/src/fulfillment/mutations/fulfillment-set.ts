import { CreateServiceZoneDTO, UpdateServiceZoneDTO } from "./service-zone"

export interface CreateFulfillmentSetDTO {
  name: string
  metadata?: Record<string, unknown> | null
  service_zones?: (CreateServiceZoneDTO | UpdateServiceZoneDTO)[]
}

export interface UpdateFulfillmentSetDTO
  extends Partial<CreateFulfillmentSetDTO> {
  id: string
}
