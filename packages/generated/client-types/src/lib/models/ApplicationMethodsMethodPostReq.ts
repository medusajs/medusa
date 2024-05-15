/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The promotion's application method.
 */
export interface ApplicationMethodsMethodPostReq {
  /**
   * The application method's description.
   */
  description?: string
  /**
   * The application method's value.
   */
  value?: string
  /**
   * The application method's max quantity.
   */
  max_quantity?: number
  type?: "fixed" | "percentage"
  target_type?: "order" | "shipping_methods" | "items"
  allocation?: "each" | "across"
  /**
   * The application method's target rules.
   */
  target_rules?: Array<{
    operator: "gte" | "lte" | "gt" | "lt" | "eq" | "ne" | "in"
    /**
     * The target rule's description.
     */
    description?: string
    /**
     * The target rule's attribute.
     */
    attribute: string
    /**
     * The target rule's values.
     */
    values: Array<string>
  }>
  /**
   * The application method's buy rules.
   */
  buy_rules?: Array<{
    operator: "gte" | "lte" | "gt" | "lt" | "eq" | "ne" | "in"
    /**
     * The buy rule's description.
     */
    description?: string
    /**
     * The buy rule's attribute.
     */
    attribute: string
    /**
     * The buy rule's values.
     */
    values: Array<string>
  }>
  /**
   * The application method's apply to quantity.
   */
  apply_to_quantity?: number
  /**
   * The application method's buy rules min quantity.
   */
  buy_rules_min_quantity?: number
}
