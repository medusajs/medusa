/**
 * @experimental
 */
export interface RuleValueOptionsResponse {
  id: string
  value: string
  label: string
}

/**
 * @experimental
 */
export interface AdminRuleValueOptionsListResponse {
  values: RuleValueOptionsResponse[]
}
