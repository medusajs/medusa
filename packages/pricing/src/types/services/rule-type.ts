import { BaseFilterable } from "@medusajs/types"

export interface CreateRuleTypeDTO {
  id?: string
  name: string
  rule_attribute: string
  default_priority?: number
}

export interface UpdateRuleTypeDTO {
  id: string
  name?: string
  rule_attribute?: string
  default_priority?: number
}

export interface RuleTypeDTO {
  id: string
  name: string
  rule_attribute: string
  default_priority: number
}

export interface FilterableRuleTypeProps
  extends BaseFilterable<FilterableRuleTypeProps> {
  id?: string[]
  name?: string[]
  rule_attribute?: string[]
}
