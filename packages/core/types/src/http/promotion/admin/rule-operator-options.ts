/**
 * @experimental
 */
export interface RuleOperatorOptionsResponse {
  id: string
  value: string
  label: string
}

/**
 * @experimental
 */
export interface AdminRuleOperatorOptionsListResponse {
  operators: RuleOperatorOptionsResponse[]
}
