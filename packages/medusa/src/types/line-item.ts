import { CalculationContextData } from "./totals"

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
  cart?: CalculationContextData
}
