import { PricingTypes } from "../../bundles"
import { BaseFilterable } from "../../dal"

export enum RuleTypeKind {
  PRIORITY = "priority",
  FILTER = "filter",
}

export interface RuleTypeDTO {
  id: string
  name: string
  key_value: string
  default_priority: number
  kind: PricingTypes.RuleTypeKind
  is_dynamic: boolean
}

export interface CreateRuleTypeDTO {
  id?: string
  name: string
  key_value: string
  default_priority?: number
  kind?: PricingTypes.RuleTypeKind
  is_dynamic?: boolean
}

export interface UpdateRuleTypeDTO {
  id: string
  name?: string
  key_value?: string
  default_priority?: number
  kind?: PricingTypes.RuleTypeKind
  is_dynamic?: boolean
}

export interface FilterableRuleTypeProps
  extends BaseFilterable<FilterableRuleTypeProps> {
  id?: string[]
  name?: string[]
}
