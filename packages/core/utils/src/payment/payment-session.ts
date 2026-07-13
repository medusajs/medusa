/**
 * @enum
 *
 * The status of a payment session.
 */
export enum PaymentSessionStatus {
  /**
   * The payment is authorized.
   */
  AUTHORIZED = "authorized",
  /**
   * The payment is captured.
   */
  CAPTURED = "captured",
  /**
   * The payment is pending.
   */
  PENDING = "pending",
  /**
   * The payment requires an action.
   */
  REQUIRES_MORE = "requires_more",
  /**
   * An error occurred while processing the payment.
   */
  ERROR = "error",
  /**
   * The payment is canceled.
   */
  CANCELED = "canceled",
  /**
   * The payment authorization is pending and expected to be completed asynchronously
   * (e.g., bank transfers, payment links, vouchers, etc.).
   */
  PENDING_AUTHORIZATION = "pending_authorization",
}
