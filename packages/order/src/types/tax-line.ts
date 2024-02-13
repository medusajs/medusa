export interface UpdateOrderTaxLineDTO {
  id: string
  description?: string
  tax_rate_id?: string
  code?: string
  rate?: number
  provider_id?: string
}

export interface CreateOrderTaxLineDTO {
  description?: string
  tax_rate_id?: string
  code: string
  rate: number
  provider_id?: string
}
