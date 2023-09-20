import { LineItemCreateData } from "@medusajs/utils"

import { CalculationContextData } from "./totals"

export type GenerateInputData = LineItemCreateData

export type GenerateLineItemContext = {
  region_id?: string
  unit_price?: number
  includes_tax?: boolean
  metadata?: Record<string, unknown>
  customer_id?: string
  order_edit_id?: string
  cart?: CalculationContextData
}
