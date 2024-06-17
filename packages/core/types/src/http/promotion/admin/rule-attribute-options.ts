export interface RuleAttributeOptionsResponse {
  id: string
  value: string
  label: string
  field_type: string
  required: boolean
  disguised: boolean
  operators: {
    id: string
    value: string
    label: string
  }[]
}

export interface AdminRuleAttributeOptionsListResponse {
  attributes: RuleAttributeOptionsResponse[]
}
