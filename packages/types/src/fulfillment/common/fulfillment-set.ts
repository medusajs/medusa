import { ServiceZoneDTO } from "./service-zone"

export interface FulfillmentSetDTO {
  id: string
  name: string
  type: string
  metadata: Record<string, unknown> | null
  service_zones: ServiceZoneDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
