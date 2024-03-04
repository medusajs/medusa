import { CreateFulfillmentAddressDTO } from "./fulfillment-address"
import { CreateFulfillmentItemDTO } from "./fulfillment-item"
import { CreateFulfillmentLabelDTO } from "./fulfillment-label"

export interface CreateFulfillmentOrderDTO {}

export interface CreateFulfillmentDTO {
  location_id: string
  packed_at?: Date | null
  shipped_at?: Date | null
  delivered_at?: Date | null
  canceled_at?: Date | null
  data?: Record<string, unknown> | null
  provider_id: string
  shipping_option_id?: string | null
  metadata?: Record<string, unknown> | null
  delivery_address: Omit<CreateFulfillmentAddressDTO, "fulfillment_id">
  items: Omit<CreateFulfillmentItemDTO, "fulfillment_id">[]
  labels: Omit<CreateFulfillmentLabelDTO, "fulfillment_id">[]
  order: CreateFulfillmentOrderDTO
}

export interface UpdateFulfillmentDTO {
  id: string
  location_id?: string
  packed_at?: Date | null
  shipped_at?: Date | null
  delivered_at?: Date | null
  data?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
}
