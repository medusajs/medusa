import { BaseFilterable } from "../../dal"

/**
 * @interface
 *
 * A rule type's data.
 */
export interface RuleTypeDTO {
  /**
   * The ID of the rule type.
   */
  id: string
  /**
   * The display name of the rule type.
   */
  name: string
  /**
   * The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of
   * the `calculatePrices` method to specify a rule for calculating the price.
   */
  rule_attribute: string
  /**
   * The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy
   * the provided context. The higher the value, the higher the priority of the rule type.
   */
  default_priority: number
  /**
   * The creation date of the rule type.
   */
  created_at?: Date | string
  /**
   * The update date of the rule type.
   */
  updated_at?: Date | string
}

/**
 * @interface
 *
 * The rule type to create.
 */
export interface CreateRuleTypeDTO {
  /**
   * The ID of the rule type.
   */
  id?: string
  /**
   * The display name of the rule type.
   */
  name: string
  /**
   * The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices`
   * method to specify a rule for calculating the price.
   */
  rule_attribute: string
  /**
   * The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context.
   * The higher the value, the higher the priority of the rule type.
   */
  default_priority?: number
}

/**
 * @interface
 *
 * The data to update in a rule type. The `id` is used to identify which price set to update.
 */
export interface UpdateRuleTypeDTO {
  /**
   * The ID of the rule type to update.
   */
  id: string
  /**
   * The display name of the rule type.
   */
  name?: string
  /**
   * The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
   */
  rule_attribute?: string
  /**
   * The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
   */
  default_priority?: number
}

/**
 * @interface
 *
 * Filters to apply on rule types.
 */
export interface FilterableRuleTypeProps
  extends BaseFilterable<FilterableRuleTypeProps> {
  /**
   * The IDs to filter rule types by.
   */
  id?: string[]
  /**
   * The names to filter rule types by.
   */
  name?: string[]
  /**
   * The rule attributes to filter rule types by.
   */
  rule_attribute?: string[]
}
