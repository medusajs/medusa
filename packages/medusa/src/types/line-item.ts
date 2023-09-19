import { CalculationContextData } from "./totals"

export type GenerateInputData = {
  variantId: string
  title: string
  product_id: string
  product: {
    title: string
    thumbnail: string | null
    discountable: boolean
    is_giftcard: boolean
  }
  quantity: number
  metadata?: Record<string, unknown>
  unit_price?: number
}

export type GenerateLineItemContext = {
  region_id?: string
  unit_price?: number
  includes_tax?: boolean
  metadata?: Record<string, unknown>
  customer_id?: string
  order_edit_id?: string
  cart?: CalculationContextData
}
