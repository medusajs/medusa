/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostDiscountsReq {
  /**
   * A unique code that will be used to redeem the discount
   */
  code: string
  /**
   * Whether the discount should have multiple instances of itself, each with a different code. This can be useful for automatically generated discount codes that all have to follow a common set of rules.
   */
  is_dynamic?: boolean
  /**
   * The discount rule that defines how discounts are calculated
   */
  rule: {
    /**
     * A short description of the discount
     */
    description?: string
    /**
     * The type of the discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers.
     */
    type: "fixed" | "percentage" | "free_shipping"
    /**
     * The value that the discount represents. This will depend on the type of the discount.
     */
    value: number
    /**
     * The scope that the discount should apply to. `total` indicates that the discount should be applied on the cart total, and `item` indicates that the discount should be applied to each discountable item in the cart.
     */
    allocation: "total" | "item"
    /**
     * A set of conditions that can be used to limit when the discount can be used. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups` should be provided based on the discount condition's type.
     */
    conditions?: Array<{
      /**
       * Operator of the condition. `in` indicates that discountable resources are within the specified resources. `not_in` indicates that discountable resources are everything but the specified resources.
       */
      operator: "in" | "not_in"
      /**
       * list of product IDs if the condition's type is `products`.
       */
      products?: Array<string>
      /**
       * list of product type IDs if the condition's type is `product_types`.
       */
      product_types?: Array<string>
      /**
       * list of product collection IDs if the condition's type is `product_collections`.
       */
      product_collections?: Array<string>
      /**
       * list of product tag IDs if the condition's type is `product_tags`.
       */
      product_tags?: Array<string>
      /**
       * list of customer group IDs if the condition's type is `customer_groups`.
       */
      customer_groups?: Array<string>
    }>
  }
  /**
   * Whether the discount code is disabled on creation. If set to `true`, it will not be available for customers.
   */
  is_disabled?: boolean
  /**
   * The date and time at which the discount should be available.
   */
  starts_at?: string
  /**
   * The date and time at which the discount should no longer be available.
   */
  ends_at?: string
  /**
   * The duration the discount runs between
   */
  valid_duration?: string
  /**
   * A list of region IDs representing the Regions in which the Discount can be used.
   */
  regions: Array<string>
  /**
   * Maximum number of times the discount can be used
   */
  usage_limit?: number
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
