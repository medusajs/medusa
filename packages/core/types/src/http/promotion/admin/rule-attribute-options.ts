export interface RuleAttributeOptionsResponse {
  id: string
  value: string
  label: string
  field_type: string
  required: boolean
  disguised: boolean
}

export interface AdminRuleAttributeOptionsListResponse {
  attributes: RuleAttributeOptionsResponse[]
}
