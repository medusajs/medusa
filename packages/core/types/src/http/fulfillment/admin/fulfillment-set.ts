import { ServiceZoneResponse } from "./service-zone"

export interface FulfillmentSetResponse {
  id: string
  name: string
  type: string
  metadata: Record<string, unknown> | null
  service_zones: ServiceZoneResponse[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface AdminFulfillmentSetResponse {
  fulfillment_set: FulfillmentSetResponse
}
