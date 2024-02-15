import { BigNumberInput } from "@medusajs/types"

export interface UpdateOrderTaxLineDTO {
  id: string
  description?: string
  tax_rate_id?: string
  code?: string
  rate?: BigNumberInput
  provider_id?: string
}

export interface CreateOrderTaxLineDTO {
  description?: string
  tax_rate_id?: string
  code: string
  rate: BigNumberInput
  provider_id?: string
}
