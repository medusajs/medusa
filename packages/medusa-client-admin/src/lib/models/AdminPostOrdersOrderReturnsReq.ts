/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostOrdersOrderReturnsReq = {
  /**
   * The Line Items that will be returned.
   */
  items: Array<any>;
  /**
   * The Shipping Method to be used to handle the return shipment.
   */
  return_shipping?: {
    /**
     * The ID of the Shipping Option to create the Shipping Method from.
     */
    option_id?: string;
    /**
     * The price to charge for the Shipping Method.
     */
    price?: number;
  };
  /**
   * An optional note with information about the Return.
   */
  note?: string;
  /**
   * A flag to indicate if the Return should be registerd as received immediately.
   */
  receive_now?: boolean;
  /**
   * A flag to indicate if no notifications should be emitted related to the requested Return.
   */
  no_notification?: boolean;
  /**
   * The amount to refund.
   */
  refund?: number;
};

