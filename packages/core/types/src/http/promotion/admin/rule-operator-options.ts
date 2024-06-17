export interface RuleOperatorOptionsResponse {
  id: string
  value: string
  label: string
}

export interface AdminRuleOperatorOptionsListResponse {
  operators: RuleOperatorOptionsResponse[]
}
