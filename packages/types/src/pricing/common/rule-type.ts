import { BaseFilterable } from "../../dal"

export interface RuleTypeDTO {
  id: string
  name: string
  key_value: string
  default_priority: number
}

export interface CreateRuleTypeDTO {
  id?: string
  name: string
  key_value: string
  default_priority?: number
}

export interface UpdateRuleTypeDTO {
  id: string
  name?: string
  key_value?: string
  default_priority?: number
}

export interface FilterableRuleTypeProps
  extends BaseFilterable<FilterableRuleTypeProps> {
  id?: string[]
  name?: string[]
}
