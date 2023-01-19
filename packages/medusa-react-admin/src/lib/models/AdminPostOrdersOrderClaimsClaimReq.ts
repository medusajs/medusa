/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostOrdersOrderClaimsClaimReq = {
  /**
   * The Claim Items that the Claim will consist of.
   */
  claim_items?: Array<any>;
  /**
   * The Shipping Methods to send the additional Line Items with.
   */
  shipping_methods?: Array<any>;
  /**
   * If set to true no notification will be send related to this Swap.
   */
  no_notification?: boolean;
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>;
};

