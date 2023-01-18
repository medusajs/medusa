/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Refund represent an amount of money transfered back to the Customer for a given reason. Refunds may occur in relation to Returns, Swaps and Claims, but can also be initiated by a store operator.
 */
export type Refund = {
  /**
   * The refund's ID
   */
  id?: string;
  /**
   * The id of the Order that the Refund is related to.
   */
  order_id: string;
  /**
   * The amount that has be refunded to the Customer.
   */
  amount: number;
  /**
   * An optional note explaining why the amount was refunded.
   */
  note?: string;
  /**
   * The reason given for the Refund, will automatically be set when processed as part of a Swap, Claim or Return.
   */
  reason?: 'discount' | 'return' | 'swap' | 'claim' | 'other';
  /**
   * Randomly generated key used to continue the completion of the refund in case of failure.
   */
  idempotency_key?: string;
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

