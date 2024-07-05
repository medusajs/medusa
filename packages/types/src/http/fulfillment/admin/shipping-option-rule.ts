/**
 * @experimental
 */
export interface AdminShippingOptionRuleResponse {
  id: string
  attribute: string
  operator: string
  value: { value: string | string[] } | null
  shipping_option_id: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
