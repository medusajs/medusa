/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StoreGetOrdersParams = {
  /**
   * The display id given to the Order.
   */
  display_id: number;
  /**
   * The email associated with this order.
   */
  email: string;
  /**
   * The shipping address associated with this order.
   */
  shipping_address?: {
    /**
     * The postal code of the shipping address
     */
    postal_code?: string;
  };
};

