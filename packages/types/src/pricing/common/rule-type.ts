import { BaseFilterable } from "../../dal"

/**
 * @interface
 * 
 * A rule type's data.
 * 
 * @prop id - The ID of the rule type.
 * @prop name - The display name of the rule type.
 * @prop rule_attribute - The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
 * @prop default_priority - The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
 */
export interface RuleTypeDTO {
  id: string
  name: string
  rule_attribute: string
  default_priority: number
}

/**
 * @interface
 * 
 * The rule type to create.
 * 
 * @prop id - The ID of the rule type.
 * @prop name - The display name of the rule type.
 * @prop rule_attribute - The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
 * @prop default_priority - The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
 */
export interface CreateRuleTypeDTO {
  id?: string
  name: string
  rule_attribute: string
  default_priority?: number
}

/**
 * @interface
 * 
 * The data to update in a rule type. The `id` is used to identify which price set to update.
 * 
 * @prop id - The ID of the rule type to update.
 * @prop name - The display name of the rule type.
 * @prop rule_attribute - The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
 * @prop default_priority - The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
 */
export interface UpdateRuleTypeDTO {
  id: string
  name?: string
  rule_attribute?: string
  default_priority?: number
}

/**
 * @interface
 * 
 * Filters to apply on rule types.
 * 
 * @prop id - The IDs to filter rule types by.
 * @prop name - The names to filter rule types by.
 * @prop rule_attribute - The rule attributes to filter rule types by.
 */
export interface FilterableRuleTypeProps
  extends BaseFilterable<FilterableRuleTypeProps> {
  id?: string[]
  name?: string[]
  rule_attribute?: string[]
}
