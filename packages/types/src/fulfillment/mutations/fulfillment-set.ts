import { CreateServiceZoneDTO } from "./service-zone"

export interface CreateFulfillmentSetDTO {
  name: string
  type: string
  service_zones?: (Omit<CreateServiceZoneDTO, "fulfillment_set_id"> & {
    fulfillment_set?: string
  })[]
}

export interface UpdateFulfillmentSetDTO
  extends Partial<CreateFulfillmentSetDTO> {
  id: string
}
