import { FulfillmentDTO } from "./fulfillment"

export interface FulfillmentItemDTO {
  id: string
  title: string
  quantity: number
  sku: string
  barcode: string
  line_item_id: string | null
  inventory_item_id: string | null
  fulfillment_id: string
  fulfillment: FulfillmentDTO
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
