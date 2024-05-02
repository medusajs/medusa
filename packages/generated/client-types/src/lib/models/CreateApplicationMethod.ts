/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ApplicationMethod } from "./ApplicationMethod"
import type { Campaign } from "./Campaign"

/**
 * The promotion's application method.
 */
export interface CreateApplicationMethod {
  type: "fixed" | "percentage"
  target_type: "order" | "shipping_methods" | "items"
  allocation?: "each" | "across"
  /**
   * The application method's value.
   */
  value?: number
  /**
   * The application method's max quantity.
   */
  max_quantity?: number
  /**
   * The application method's buy rules min quantity.
   */
  buy_rules_min_quantity?: number
  /**
   * The application method's apply to quantity.
   */
  apply_to_quantity?: number
  promotion?:
    | string
    | {
        /**
         * The promotion's ID.
         */
        id: string
        /**
         * The promotion's code.
         */
        code?: string
        type?: "standard" | "buyget"
        /**
         * The promotion's is automatic.
         */
        is_automatic?: boolean
        application_method?: ApplicationMethod
        /**
         * The promotion's rules.
         */
        rules?: Array<any>
        campaign?: Campaign
      }
  /**
   * The application method's target rules.
   */
  target_rules?: Array<{
    /**
     * The target rule's description.
     */
    description?: string
    /**
     * The target rule's attribute.
     */
    attribute: string
    operator: "gt" | "lt" | "eq" | "ne" | "in" | "lte" | "gte"
    values: string | Array<string>
  }>
  /**
   * The application method's buy rules.
   */
  buy_rules?: Array<{
    /**
     * The buy rule's description.
     */
    description?: string
    /**
     * The buy rule's attribute.
     */
    attribute: string
    operator: "gt" | "lt" | "eq" | "ne" | "in" | "lte" | "gte"
    values: string | Array<string>
  }>
}
