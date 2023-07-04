/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostPaymentRefundsReq {
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
}
