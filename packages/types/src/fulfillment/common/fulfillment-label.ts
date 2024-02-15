import { FulfillmentDTO } from "./fulfillment"

export interface FulfillmentLabelDTO {
  id: string
  tracking_number: string
  tracking_url: string
  label_url: string
  fulfillment_id: string
  fulfillment: FulfillmentDTO
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
