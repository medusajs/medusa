/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StorePostSwapsReq = {
  /**
   * The ID of the Order to create the Swap for.
   */
  order_id: string;
  /**
   * The items to include in the Return.
   */
  return_items: Array<any>;
  /**
   * The ID of the Shipping Option to create the Shipping Method from.
   */
  return_shipping_option?: string;
  /**
   * The items to exchange the returned items to.
   */
  additional_items: Array<any>;
};

