/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostOrdersOrderShipmentReq = {
  /**
   * The ID of the Fulfillment.
   */
  fulfillment_id: string;
  /**
   * The tracking numbers for the shipment.
   */
  tracking_numbers?: Array<string>;
  /**
   * If set to true no notification will be send related to this Shipment.
   */
  no_notification?: boolean;
};

