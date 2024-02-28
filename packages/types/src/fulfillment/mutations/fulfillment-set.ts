import { CreateServiceZoneDTO } from "./service-zone"

export interface CreateFulfillmentSetDTO {
  name: string
  type: string
  service_zones?: Omit<CreateServiceZoneDTO, 'fulfillment_set_id'>[]
}

export interface UpdateFulfillmentSetDTO {
  id: string
  name?: string
  type?: string
  service_zones?: (Omit<CreateServiceZoneDTO, 'fulfillment_set_id'> | { id: string })[]
}
