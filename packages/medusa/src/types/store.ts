export type UpdateStoreInput = {
  name?: string
  swap_link_template?: string
  payment_link_template?: string
  invite_link_template?: string
  default_currency_code?: string
  currencies?: string[]
  metadata?: Record<string, unknown>
  default_sales_channel_id?: string
}
