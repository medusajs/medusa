/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';

export type AdminPostOrdersOrderClaimsReq = {
  /**
   * The type of the Claim. This will determine how the Claim is treated: `replace` Claims will result in a Fulfillment with new items being created, while a `refund` Claim will refund the amount paid for the claimed items.
   */
  type: 'replace' | 'refund';
  /**
   * The Claim Items that the Claim will consist of.
   */
  claim_items: Array<any>;
  /**
   * Optional details for the Return Shipping Method, if the items are to be sent back.
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
   * The new items to send to the Customer when the Claim type is Replace.
   */
  additional_items?: Array<any>;
  /**
   * The Shipping Methods to send the additional Line Items with.
   */
  shipping_methods?: Array<any>;
  /**
   * An optional shipping address to send the claim to. Defaults to the parent order's shipping address
   */
  shipping_address?: Address;
  /**
   * The amount to refund the Customer when the Claim type is `refund`.
   */
  refund_amount?: number;
  /**
   * If set to true no notification will be send related to this Claim.
   */
  no_notification?: boolean;
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>;
};

