/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostOrdersOrderSwapsSwapFulfillmentsReq {
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
  /**
   * If set to `true`, no notification will be sent to the customer related to this swap.
   */
  no_notification?: boolean
  /**
   * The ID of the fulfillment's location.
   */
  location_id?: string
}
