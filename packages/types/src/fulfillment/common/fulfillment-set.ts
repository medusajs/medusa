import { FilterableServiceZoneProps, ServiceZoneDTO } from "./service-zone"
import { BaseFilterable } from "../../dal"

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

export interface FilterableFulfillmentSetProps
  extends BaseFilterable<FilterableFulfillmentSetProps> {
  id?: string | string[]
  name?: string | string[]
  type?: string | string[]
  service_zones?: FilterableServiceZoneProps
}
