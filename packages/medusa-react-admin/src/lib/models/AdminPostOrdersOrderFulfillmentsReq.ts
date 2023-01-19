/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostOrdersOrderFulfillmentsReq = {
  /**
   * The Line Items to include in the Fulfillment.
   */
  items: Array<any>;
  /**
   * If set to true no notification will be send related to this Swap.
   */
  no_notification?: boolean;
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>;
};

