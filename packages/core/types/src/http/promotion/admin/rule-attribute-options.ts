/**
 * @experimental
 */
export interface RuleAttributeOptionsResponse {
  id: string
  value: string
  label: string
  field_type: string
  required: boolean
  disguised: boolean
}

/**
 * @experimental
 */
export interface AdminRuleAttributeOptionsListResponse {
  attributes: RuleAttributeOptionsResponse[]
}
