<<<<<<< HEAD
import { BaseFilterable } from "../../dal"

=======
import { PricingTypes } from "../../bundles"
import { BaseFilterable } from "../../dal"

export enum RuleTypeKind {
  PRIORITY = "priority",
  FILTER = "filter",
}

>>>>>>> d53c756e1 (move rule-type to common)
export interface RuleTypeDTO {
  id: string
  name: string
  rule_attribute: string
  default_priority: number
<<<<<<< HEAD
=======
  kind: PricingTypes.RuleTypeKind
  is_dynamic: boolean  
>>>>>>> d53c756e1 (move rule-type to common)
}

export interface CreateRuleTypeDTO {
  id?: string
  name: string
  rule_attribute: string
  default_priority?: number
<<<<<<< HEAD
=======
  kind?: PricingTypes.RuleTypeKind
  is_dynamic?: boolean  
>>>>>>> d53c756e1 (move rule-type to common)
}

export interface UpdateRuleTypeDTO {
  id: string
  name?: string
  rule_attribute?: string
  default_priority?: number
<<<<<<< HEAD
=======
  kind?: PricingTypes.RuleTypeKind
  is_dynamic?: boolean  
>>>>>>> d53c756e1 (move rule-type to common)
}

export interface FilterableRuleTypeProps
  extends BaseFilterable<FilterableRuleTypeProps> {
  id?: string[]
<<<<<<< HEAD
  name?: string[]
=======
>>>>>>> d53c756e1 (move rule-type to common)
}
