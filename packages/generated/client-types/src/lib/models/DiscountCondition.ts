/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { CustomerGroup } from "./CustomerGroup"
import type { DiscountRule } from "./DiscountRule"
import type { Product } from "./Product"
import type { ProductCollection } from "./ProductCollection"
import type { ProductTag } from "./ProductTag"
import type { ProductType } from "./ProductType"

/**
 * Holds rule conditions for when a discount is applicable
 */
export interface DiscountCondition {
  /**
   * The discount condition's ID
   */
  id: string
  /**
   * The type of the condition. The type affects the available resources associated with the condition. For example, if the type is `products`, that means the `products` relation will hold the products associated with this condition and other relations will be empty.
   */
  type:
    | "products"
    | "product_types"
    | "product_collections"
    | "product_tags"
    | "customer_groups"
  /**
   * The operator of the condition. `in` indicates that discountable resources are within the specified resources. `not_in` indicates that discountable resources are everything but the specified resources.
   */
  operator: "in" | "not_in"
  /**
   * The ID of the discount rule associated with the condition
   */
  discount_rule_id: string
  /**
   * The details of the discount rule associated with the condition.
   */
  discount_rule?: DiscountRule | null
  /**
   * products associated with this condition if `type` is `products`.
   */
  products?: Array<Product>
  /**
   * Product types associated with this condition if `type` is `product_types`.
   */
  product_types?: Array<ProductType>
  /**
   * Product tags associated with this condition if `type` is `product_tags`.
   */
  product_tags?: Array<ProductTag>
  /**
   * Product collections associated with this condition if `type` is `product_collections`.
   */
  product_collections?: Array<ProductCollection>
  /**
   * Customer groups associated with this condition if `type` is `customer_groups`.
   */
  customer_groups?: Array<CustomerGroup>
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
