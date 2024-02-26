export interface UpdateCartWorkflowInputDTO {
  id: string
  promo_codes?: string[]
  region_id?: string
  customer_id?: string | null
  sales_channel_id?: string | null
  email?: string | null
  currency_code?: string
  metadata?: Record<string, unknown> | null
}
