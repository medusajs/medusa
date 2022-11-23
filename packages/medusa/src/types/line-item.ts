import { Cart, Region } from "../models"

export type GenerateInputData = {
  variantId: string
  regionId: string
  quantity: number
}

export type GenerateContext = {
  unit_price?: number
  includes_tax?: boolean
  metadata?: Record<string, unknown>
  customer_id?: string
  order_edit_id?: string
  region?: Region
  cart?: Cart
}
