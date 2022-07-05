import {
  Address,
  ClaimOrder,
  Discount,
  LineItem,
  Order,
  Payment,
  ShippingMethod,
} from "../models"

export type FulFillmentItemType = {
  item_id: string
  quantity: number
}

export type FulfillmentItemPartition = {
  shipping_method: ShippingMethod
  items: LineItem[]
}

export type CreateShipmentConfig = {
  metadata: Record<string, unknown>
  no_notification?: boolean
}

export type CreateFulfillmentOrder = Omit<ClaimOrder, "beforeInsert"> & {
  is_claim?: boolean
  email?: string
  payments: Payment[]
  discounts: Discount[]
  currency_code: string
  tax_rate: number | null
  region_id: string
  display_id: number
  billing_address: Address
  items: LineItem[]
  shipping_methods: ShippingMethod[]
  no_notification: boolean
}
