/**
 * @enum
 *
 * The status of a refund.
 */
export enum RefundStatus {
  /**
   * The refund was recorded and sent to the payment provider, which hasn't
   * answered yet.
   */
  PENDING = "pending",
  /**
   * The payment provider confirmed the refund.
   */
  SUCCEEDED = "succeeded",
  /**
   * The payment provider didn't confirm the refund. The record is soft-deleted
   * and kept so the refund can be retried with the same idempotency key.
   */
  FAILED = "failed",
}
