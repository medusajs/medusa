import { BaseSoftDeletableHttpEntity } from "../base"
import { AdminFulfillmentProvider } from "../fulfillment-provider"

export interface AdminFulfillmentItem
  extends Omit<BaseSoftDeletableHttpEntity, "metadata"> {
  title: string
  quantity: number
  sku: string
  barcode: string
  line_item_id: string | null
  inventory_item_id: string | null
  fulfillment_id: string
}

export interface AdminFulfillmentLabel
  extends Omit<BaseSoftDeletableHttpEntity, "metadata"> {
  tracking_number: string
  tracking_url: string
  label_url: string
  fulfillment_id: string
}

export interface AdminFulfillmentAddress extends BaseSoftDeletableHttpEntity {
  fulfillment_id: string | null
  company: string | null
  first_name: string | null
  last_name: string | null
  address_1: string | null
  address_2: string | null
  city: string | null
  country_code: string | null
  province: string | null
  postal_code: string | null
  phone: string | null
}

export interface AdminFulfillment extends BaseSoftDeletableHttpEntity {
  location_id: string
  packed_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  canceled_at: string | null
  data: Record<string, unknown> | null
  provider_id: string
  shipping_option_id: string | null
  provider: AdminFulfillmentProvider
  delivery_address: AdminFulfillmentAddress
  items: AdminFulfillmentItem[]
  labels: AdminFulfillmentLabel[]
}

export interface AdminFulfillmentResponse {
  fulfillment: AdminFulfillment
}
