import { BaseFilterable } from "../../dal"

/**
 * @interface
 * 
 * An object that holds the details of a rule type.
 * 
 * @prop id - A string indicating the ID of the rule type.
 * @prop name - A string indicating the display name of the rule type.
 * @prop rule_attribute - A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
 * @prop default_priority - A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
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
 * An object used when creating a rule type to specify its data.
 * 
 * @prop id - A string indicating the ID of the rule type.
 * @prop name - A string indicating the display name of the rule type.
 * @prop rule_attribute - A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
 * @prop default_priority - A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
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
 * An object used when updating a rule type to specify the data to update.
 * 
 * @prop id - A string indicating the ID of the rule type to update.
 * @prop name - A string indicating the display name of the rule type.
 * @prop rule_attribute - A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
 * @prop default_priority - A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
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
 * An object used to filter retrieved rule types.
 * 
 * @prop id - an array of strings, each being an ID to filter rule types.
 * @prop name - an array of strings, each being a name to filter rule types.
 * @prop rule_attribute - an array of strings, each being a rule attribute to filter rule types.
 */
export interface FilterableRuleTypeProps
  extends BaseFilterable<FilterableRuleTypeProps> {
  id?: string[]
  name?: string[]
  rule_attribute?: string[]
}
