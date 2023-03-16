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
   * The type of the Condition
   */
  type:
    | "products"
    | "product_types"
    | "product_collections"
    | "product_tags"
    | "customer_groups"
  /**
   * The operator of the Condition
   */
  operator: "in" | "not_in"
  /**
   * The ID of the discount rule associated with the condition
   */
  discount_rule_id: string
  /**
   * Available if the relation `discount_rule` is expanded.
   */
  discount_rule?: DiscountRule | null
  /**
   * products associated with this condition if type = products. Available if the relation `products` is expanded.
   */
  products?: Array<Product>
  /**
   * Product types associated with this condition if type = product_types. Available if the relation `product_types` is expanded.
   */
  product_types?: Array<ProductType>
  /**
   * Product tags associated with this condition if type = product_tags. Available if the relation `product_tags` is expanded.
   */
  product_tags?: Array<ProductTag>
  /**
   * Product collections associated with this condition if type = product_collections. Available if the relation `product_collections` is expanded.
   */
  product_collections?: Array<ProductCollection>
  /**
   * Customer groups associated with this condition if type = customer_groups. Available if the relation `customer_groups` is expanded.
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
