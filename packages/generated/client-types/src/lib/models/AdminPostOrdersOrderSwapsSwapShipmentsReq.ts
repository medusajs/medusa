/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostOrdersOrderSwapsSwapShipmentsReq {
  /**
   * The ID of the Fulfillment.
   */
  fulfillment_id: string
  /**
   * The tracking numbers for the shipment.
   */
  tracking_numbers?: Array<string>
  /**
   * If set to true no notification will be sent related to this Claim.
   */
  no_notification?: boolean
}
