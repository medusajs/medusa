/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Gift Card Transactions are created once a Customer uses a Gift Card to pay for their Order
 */
export type GiftCardTransaction = {
  /**
   * The gift card transaction's ID
   */
  id?: string;
  /**
   * The ID of the Gift Card that was used in the transaction.
   */
  gift_card_id: string;
  /**
   * A gift card object. Available if the relation `gift_card` is expanded.
   */
  gift_card?: Record<string, any>;
  /**
   * The ID of the Order that the Gift Card was used to pay for.
   */
  order_id?: string;
  /**
   * An order object. Available if the relation `order` is expanded.
   */
  order?: Record<string, any>;
  /**
   * The amount that was used from the Gift Card.
   */
  amount: number;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * Whether the transaction is taxable or not.
   */
  is_taxable?: boolean;
  /**
   * The tax rate of the transaction
   */
  tax_rate?: number;
};

