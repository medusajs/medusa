import {
  Address,
  ClaimOrder,
  Customer,
  Discount,
  LineItem,
  Region,
  ShippingMethod,
  Swap,
} from "../models"

export type GenerateInputData = {
  variantId: string
  quantity: number
}

export type GenerateContext = {
  region_id?: string
  region?: {
    id: string
    automatic_taxes: boolean
    tax_rate: number
    currency_code: string
  }
  unit_price?: number
  includes_tax?: boolean
  metadata?: Record<string, unknown>
  customer_id?: string
  order_edit_id?: string
  cart?: GenerateContextCartData
}

export type GenerateContextCartData = {
  discounts: Discount[]
  items: LineItem[]
  customer: Customer
  region: Region
  shipping_address?: Address | null
  swaps?: Swap[]
  claims?: ClaimOrder[]
  shipping_methods?: ShippingMethod[]
}
