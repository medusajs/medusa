import { ShippingOptionDTO } from "./shipping-option"
import { ServiceProviderDTO } from "./service-provider"
import { FulfillmentAddressDTO } from "./address"
import { FulfillmentItemDTO } from "./fulfillment-item"
import { FulfillmentLabelDTO } from "./fulfillment-label"

export interface FulfillmentDTO {
  id: string
  location_id: string
  packed_at: Date | null
  shipped_at: Date | null
  delivered_at: Date | null
  canceled_at: Date | null
  data: Record<string, unknown> | null
  provider_id: string
  shipping_option_id: string | null
  metadata: Record<string, unknown> | null
  shipping_option: ShippingOptionDTO | null
  provider: ServiceProviderDTO
  delivery_address: FulfillmentAddressDTO
  items: FulfillmentItemDTO[]
  labels: FulfillmentLabelDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
