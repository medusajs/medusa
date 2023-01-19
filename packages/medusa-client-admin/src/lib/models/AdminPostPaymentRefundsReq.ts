/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostPaymentRefundsReq = {
  /**
   * The amount to refund.
   */
  amount: number;
  /**
   * The reason for the Refund.
   */
  reason: string;
  /**
   * A note with additional details about the Refund.
   */
  note?: string;
};

