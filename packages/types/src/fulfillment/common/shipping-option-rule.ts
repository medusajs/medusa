import { ShippingOptionDTO } from "./shipping-option"
import { BaseFilterable, OperatorMap } from "../../dal"

/**
 * The shipping option rule details.
 */
export interface ShippingOptionRuleDTO {
  /**
   * The ID of the shipping option rule.
   */
  id: string

  /**
   * The attribute of the shipping option rule.
   */
  attribute: string

  /**
   * The operator of the shipping option rule.
   *
   * @example
   * in
   */
  operator: string

  /**
   * The values of the shipping option rule.
   */
  value: {
    /**
     * The values of the shipping option rule.
     */
    value: string | string[]
  } | null

  /**
   * The associated shipping option's ID.
   */
  shipping_option_id: string

  /**
   * The associated shipping option.
   */
  shipping_option: ShippingOptionDTO

  /**
   * The creation date of the shipping option rule.
   */
  created_at: Date

  /**
   * The update date of the shipping option rule.
   */
  updated_at: Date

  /**
   * The deletion date of the shipping option rule.
   */
  deleted_at: Date | null
}

/**
 * The filters to apply on the retrieved shipping option rules.
 */
export interface FilterableShippingOptionRuleProps
  extends BaseFilterable<FilterableShippingOptionRuleProps> {
  /**
   * The IDs to filter the shipping option rules by.
   */
  id?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter the shipping option rules by their attribute.
   */
  attribute?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter the shipping option rules by their operator.
   */
  operator?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter the shipping option rules by their values.
   */
  value?: string | string[] | OperatorMap<string | string[]>
}
