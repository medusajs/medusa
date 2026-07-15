export enum PaymentWebhookEvents {
  WebhookReceived = "payment.webhook_received",
}

/**
 * Normalized events from payment provider to internal payment module events. In principle, these should match the payment status.
 */
export enum PaymentActions {
  /**
   * Payment session has been authorized and there are available funds for capture.
   */
  AUTHORIZED = "authorized",
  /**
   * Payment was successful and the mount is captured.
   */
  SUCCESSFUL = "captured",
  /**
   * Payment failed.
   */
  FAILED = "failed",
  /**
   * Payment is pending.
   */
  PENDING = "pending",
  /**
   * Payment requires more information.
   */
  REQUIRES_MORE = "requires_more",
  /**
   * Payment was canceled.
   */
  CANCELED = "canceled",
  /**
   * Received an event that is not processable.
   */
  NOT_SUPPORTED = "not_supported",
  /**
   * Payment authorization is pending and expected to complete asynchronously
   * (e.g., bank transfers, payment links, vouchers).
   */
  PENDING_AUTHORIZATION = "pending_authorization",
}
