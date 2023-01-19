/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Gift Cards are redeemable and represent a value that can be used towards the payment of an Order.
 */
export type GiftCard = {
  /**
   * The cart's ID
   */
  id?: string;
  /**
   * The unique code that identifies the Gift Card. This is used by the Customer to redeem the value of the Gift Card.
   */
  code: string;
  /**
   * The value that the Gift Card represents.
   */
  value: number;
  /**
   * The remaining value on the Gift Card.
   */
  balance: number;
  /**
   * The id of the Region in which the Gift Card is available.
   */
  region_id: string;
  /**
   * A region object. Available if the relation `region` is expanded.
   */
  region?: Record<string, any>;
  /**
   * The id of the Order that the Gift Card was purchased in.
   */
  order_id?: string;
  /**
   * An order object. Available if the relation `order` is expanded.
   */
  order?: Record<string, any>;
  /**
   * Whether the Gift Card has been disabled. Disabled Gift Cards cannot be applied to carts.
   */
  is_disabled?: boolean;
  /**
   * The time at which the Gift Card can no longer be used.
   */
  ends_at?: string;
  /**
   * The gift cards's tax rate that will be applied on calculating totals
   */
  tax_rate?: number;
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

