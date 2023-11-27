/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostOrdersOrderRefundsReq {
  /**
   * The amount to refund. It should be less than or equal the `refundable_amount` of the order.
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
   * If set to `true`, no notification will be sent to the customer related to this Refund.
   */
  no_notification?: boolean
}
