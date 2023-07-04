/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostOrdersOrderRefundsReq {
  /**
   * The amount to refund.
   */
  amount: number
  /**
   * The reason for the Refund.
   */
  reason: string
  /**
   * A note with additional details about the Refund.
   */
  note?: string
  /**
   * If set to true no notification will be send related to this Refund.
   */
  no_notification?: boolean
}
