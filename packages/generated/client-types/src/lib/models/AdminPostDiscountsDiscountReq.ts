/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostDiscountsDiscountReq {
  /**
   * A unique code that will be used to redeem the Discount
   */
  code?: string
  /**
   * The Discount Rule that defines how Discounts are calculated
   */
  rule?: {
    /**
     * The ID of the Rule
     */
    id: string
    /**
     * A short description of the discount
     */
    description?: string
    /**
     * The value that the discount represents; this will depend on the type of the discount
     */
    value?: number
    /**
     * The scope that the discount should apply to.
     */
    allocation?: "total" | "item"
    /**
     * A set of conditions that can be used to limit when the discount can be used. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups` should be provided.
     */
    conditions?: Array<{
      /**
       * The ID of the Rule
       */
      id?: string
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
   * Maximum times the discount can be used
   */
  usage_limit?: number
  /**
   * A list of Region ids representing the Regions in which the Discount can be used.
   */
  regions?: Array<string>
  /**
   * An object containing metadata of the discount
   */
  metadata?: Record<string, any>
}
