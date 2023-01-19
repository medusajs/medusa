/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StorePostReturnsReq = {
  /**
   * The ID of the Order to create the Return from.
   */
  order_id: string;
  /**
   * The items to include in the Return.
   */
  items: Array<any>;
  /**
   * If the Return is to be handled by the store operator the Customer can choose a Return Shipping Method. Alternatvely the Customer can handle the Return themselves.
   */
  return_shipping?: {
    /**
     * The ID of the Shipping Option to create the Shipping Method from.
     */
    option_id: string;
  };
};

