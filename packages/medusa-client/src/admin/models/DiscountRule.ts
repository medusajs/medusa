/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Holds the rules that governs how a Discount is calculated when applied to a Cart.
 */
export type DiscountRule = {
  /**
   * The discount rule's ID
   */
  id?: string;
  /**
   * The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers.
   */
  type: 'fixed' | 'percentage' | 'free_shipping';
  /**
   * A short description of the discount
   */
  description?: string;
  /**
   * The value that the discount represents; this will depend on the type of the discount
   */
  value: number;
  /**
   * The scope that the discount should apply to.
   */
  allocation?: 'total' | 'item';
  /**
   * A set of conditions that can be used to limit when  the discount can be used. Available if the relation `conditions` is expanded.
   */
  conditions?: Array<Record<string, any>>;
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

