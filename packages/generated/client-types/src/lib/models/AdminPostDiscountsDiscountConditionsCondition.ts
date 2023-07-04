/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostDiscountsDiscountConditionsCondition {
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
}
