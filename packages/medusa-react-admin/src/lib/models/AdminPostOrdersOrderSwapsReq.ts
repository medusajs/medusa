/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostOrdersOrderSwapsReq = {
  /**
   * The Line Items to return as part of the Swap.
   */
  return_items: Array<any>;
  /**
   * How the Swap will be returned.
   */
  return_shipping?: {
    /**
     * The ID of the Shipping Option to create the Shipping Method from.
     */
    option_id: string;
    /**
     * The price to charge for the Shipping Method.
     */
    price?: number;
  };
  /**
   * The new items to send to the Customer.
   */
  additional_items?: Array<any>;
  /**
   * The custom shipping options to potentially create a Shipping Method from.
   */
  custom_shipping_options?: Array<any>;
  /**
   * If set to true no notification will be send related to this Swap.
   */
  no_notification?: boolean;
  /**
   * If true, swaps can be completed with items out of stock
   */
  allow_backorder?: boolean;
};

