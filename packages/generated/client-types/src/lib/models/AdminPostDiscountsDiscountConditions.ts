/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostDiscountsDiscountConditions {
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
}
