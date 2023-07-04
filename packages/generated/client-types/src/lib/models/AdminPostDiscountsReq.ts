/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostDiscountsReq {
  /**
   * A unique code that will be used to redeem the Discount
   */
  code: string
  /**
   * Whether the Discount should have multiple instances of itself, each with a different code. This can be useful for automatically generated codes that all have to follow a common set of rules.
   */
  is_dynamic?: boolean
  /**
   * The Discount Rule that defines how Discounts are calculated
   */
  rule: {
    /**
     * A short description of the discount
     */
    description?: string
    /**
     * The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers.
     */
    type: "fixed" | "percentage" | "free_shipping"
    /**
     * The value that the discount represents; this will depend on the type of the discount
     */
    value: number
    /**
     * The scope that the discount should apply to.
     */
    allocation: "total" | "item"
    /**
     * A set of conditions that can be used to limit when  the discount can be used. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups` should be provided.
     */
    conditions?: Array<{
      /**
       * Operator of the condition
       */
      operator: "in" | "not_in"
      /**
       * list of product IDs if the condition is applied on products.
       */
      products?: Array<string>
      /**
       * list of product type IDs if the condition is applied on product types.
       */
      product_types?: Array<string>
      /**
       * list of product collection IDs if the condition is applied on product collections.
       */
      product_collections?: Array<string>
      /**
       * list of product tag IDs if the condition is applied on product tags.
       */
      product_tags?: Array<string>
      /**
       * list of customer group IDs if the condition is applied on customer groups.
       */
      customer_groups?: Array<string>
    }>
  }
  /**
   * Whether the Discount code is disabled on creation. You will have to enable it later to make it available to Customers.
   */
  is_disabled?: boolean
  /**
   * The time at which the Discount should be available.
   */
  starts_at?: string
  /**
   * The time at which the Discount should no longer be available.
   */
  ends_at?: string
  /**
   * Duration the discount runs between
   */
  valid_duration?: string
  /**
   * A list of Region ids representing the Regions in which the Discount can be used.
   */
  regions: Array<string>
  /**
   * Maximum times the discount can be used
   */
  usage_limit?: number
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
