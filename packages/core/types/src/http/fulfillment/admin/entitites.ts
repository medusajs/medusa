import { AdminFulfillmentProvider } from "../../fulfillment-provider"

export interface AdminFulfillmentItem {
  id: string
  title: string
  quantity: number
  sku: string
  barcode: string
  line_item_id: string | null
  inventory_item_id: string | null
  fulfillment_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AdminFulfillmentLabel {
  id: string
  tracking_number: string
  tracking_url: string
  label_url: string
  fulfillment_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AdminFulfillmentAddress {
  id: string
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
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AdminFulfillment {
  id: string
  location_id: string
  provider_id: string
  shipping_option_id: string | null
  provider: AdminFulfillmentProvider
  delivery_address: AdminFulfillmentAddress
  items: AdminFulfillmentItem[]
  labels: AdminFulfillmentLabel[]
  packed_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  canceled_at: string | null
  data: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}
