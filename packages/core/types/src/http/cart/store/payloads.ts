import { StoreCartAddress, StoreCartLineItem } from "./entities"

export interface StoreCreateCart {
  region_id?: string
  shipping_address?: StoreCartAddress
  billing_address?: StoreCartAddress
  email?: string
  currency_code?: string
  items?: StoreCartLineItem[]
  sales_channel_id?: string
  metadata?: Record<string, unknown>
}

export interface StoreUpdateCart {
  region_id?: string
  shipping_address?: StoreCartAddress
  billing_address?: StoreCartAddress
  email?: string
  sales_channel_id?: string
  metadata?: Record<string, unknown>
  promo_codes?: string[]
}

export interface StoreAddCartLineItem {
  variant_id: string
  quantity: number
  metadata?: Record<string, unknown>
}

export interface StoreUpdateCartLineItem {
  quantity: number
  metadata?: Record<string, unknown>
}

export interface StoreAddCartShippingMethods {
  option_id: string
  data?: Record<string, unknown>
}

export interface StoreCompleteCart {
  idempotency_key?: string
}
