/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DiscountRule } from './DiscountRule';

/**
 * Holds rule conditions for when a discount is applicable
 */
export type DiscountCondition = {
  /**
   * The discount condition's ID
   */
  id?: string;
  /**
   * The type of the Condition
   */
  type: 'products' | 'product_types' | 'product_collections' | 'product_tags' | 'customer_groups';
  /**
   * The operator of the Condition
   */
  operator: 'in' | 'not_in';
  /**
   * The ID of the discount rule associated with the condition
   */
  discount_rule_id: string;
  /**
   * Available if the relation `discount_rule` is expanded.
   */
  discount_rule?: DiscountRule;
  /**
   * products associated with this condition if type = products. Available if the relation `products` is expanded.
   */
  products?: Array<Record<string, any>>;
  /**
   * product types associated with this condition if type = product_types. Available if the relation `product_types` is expanded.
   */
  product_types?: Array<Record<string, any>>;
  /**
   * product tags associated with this condition if type = product_tags. Available if the relation `product_tags` is expanded.
   */
  product_tags?: Array<Record<string, any>>;
  /**
   * product collections associated with this condition if type = product_collections. Available if the relation `product_collections` is expanded.
   */
  product_collections?: Array<Record<string, any>>;
  /**
   * customer groups associated with this condition if type = customer_groups. Available if the relation `customer_groups` is expanded.
   */
  customer_groups?: Array<Record<string, any>>;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at?: string;
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>;
};

