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
   * If set to true no notification will be send related to this Claim.
   */
  no_notification?: boolean
}
