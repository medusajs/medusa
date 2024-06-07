interface AdminCreateFulfillmentItem {
  title: string
  sku: string
  quantity: number
  barcode: string
  line_item_id?: string
  inventory_item_id?: string
}

interface AdminCreateFulfillmentLabel {
  tracking_number: string
  tracking_url: string
  label_url: string
}

interface AdminFulfillmentDeliveryAddress {
  first_name?: string
  last_name?: string
  phone?: string
  company?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  metadata?: Record<string, string> | null
}

export interface AdminCreateFulfillment {
  location_id: string
  provider_id: string
  delivery_address: AdminFulfillmentDeliveryAddress
  items: AdminCreateFulfillmentItem[]
  labels: AdminCreateFulfillmentLabel[]
  // TODO: Validator requires an empty object for the order field.
  // This is a temporary solution until the order field is
  // removed or typed correctly.
  order: Record<string, unknown>
  order_id: string
  metadata?: Record<string, unknown> | null
}

export interface AdminCreateFulfillmentShipment {
  labels: AdminCreateFulfillmentLabel[]
}
