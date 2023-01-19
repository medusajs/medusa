/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostOrdersOrderClaimsClaimShipmentsReq = {
  /**
   * The ID of the Fulfillment.
   */
  fulfillment_id: string;
  /**
   * The tracking numbers for the shipment.
   */
  tracking_numbers?: Array<string>;
};

