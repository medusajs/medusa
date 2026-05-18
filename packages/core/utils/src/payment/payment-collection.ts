/**
 * @enum
 *
 * The payment collection's status.
 */
export enum PaymentCollectionStatus {
  /**
   * The payment collection isn't paid.
   */
  NOT_PAID = "not_paid",
  /**
   * The payment collection is awaiting payment.
   */
  AWAITING = "awaiting",
  /**
   * The payment collection is authorized.
   */
  AUTHORIZED = "authorized",
  /**
   * Some of the payments in the payment collection are authorized.
   */
  PARTIALLY_AUTHORIZED = "partially_authorized",
  /**
   * The payment collection is canceled.
   */
  CANCELED = "canceled",
  /**
   * The payment collection is failed.
   */
  FAILED = "failed",
  /**
   * The payment collection is partially captured.
   */
  PARTIALLY_CAPTURED = "partially_captured",
  /**
   * The payment collection is completed.
   */
  COMPLETED = "completed",
  /**
   * The payment collection has a chargeback.
   */
  CHARGEBACK = "chargeback",
}
