import { DeleteResponse } from "../../common"
import { AdminFulfillmentAddressResponse } from "./fulfillment-address"
import { AdminFulfillmentItemResponse } from "./fulfillment-item"
import { AdminFulfillmentLabelResponse } from "./fulfillment-label"
import { AdminFulfillmentProvider } from "./fulfillment-provider"

export interface AdminFulfillmentResponse {
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
  provider: AdminFulfillmentProvider
  delivery_address: AdminFulfillmentAddressResponse
  items: AdminFulfillmentItemResponse[]
  labels: AdminFulfillmentLabelResponse[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface AdminFulfillmentSetsDeleteResponse
  extends DeleteResponse<"fulfillment_set"> {}
