import { CreateServiceZoneDTO } from "./service-zone"

export interface CreateFulfillmentSetDTO {
  name: string
  type: string
  service_zones?: (CreateServiceZoneDTO | { id: string })[]
}

export interface UpdateFulfillmentSetDTO
  extends Partial<CreateFulfillmentSetDTO> {
  id: string
}
